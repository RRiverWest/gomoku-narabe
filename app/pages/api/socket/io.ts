import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";
import type { Stone } from "@/store/boardStore";
import { checkLines } from "@/lib/check-lines";
import type { RoomInfo } from "@/store/boardStore";

let nextRoomId = 1;
type PlayerNumber = 1 | 2;
interface RoomState {
	players: Map<string, PlayerNumber>;
	spectators: Set<string>;
	playing: boolean;
	stones: Stone[];
	turn: PlayerNumber | null;
}

const rooms = new Map<string, RoomState>();

export default function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO
) {
	if (!res.socket.server.io) {
		console.log("Socket.IO server starting...");

		const io = new Server(res.socket.server, {
			path: "/api/socket/io",
			addTrailingSlash: false,
		});

		io.on("connection", (socket) => {
			console.log("client connected: ", socket.id);

			socket.on("make-room", () => {
				const roomId = nextRoomId.toString();
				nextRoomId++;
				const room: RoomState = {
					players: new Map(),
					spectators: new Set(),
					playing: false,
					stones: [],
					turn: null
				};
				rooms.set(roomId, room);
				broadcastRoomList(io);
				socket.emit("made-room", roomId);
				console.log(`made room from ${socket.id}, roomId: ${roomId}`);
			});

			socket.on("join-room", (roomId: string) => {
				let role: "player" | "spectator";
				let playerNumber: 1 | 2 | null = null;
				let room = rooms.get(roomId);

				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}, pint: join-room`);
					console.log("error", `cannot find room : ${roomId}, pint: join-room`);
					return;
				}

				if (room.players.has(socket.id) || room.spectators.has(socket.id)) { return; }

				if (room.players.size < 2) {
					playerNumber = room.players.size == 0 ? 1 : 2;
					room.players.set(socket.id, playerNumber);
					role = "player";
				} else {
					room.spectators.add(socket.id);
					role = "spectator";
				}
				socket.join(roomId);
				socket.emit("joined-room", role, playerNumber, roomId);
				console.log(`joined new client${socket.id} to roomId: ${roomId}`);

				if (playerNumber == 2) {
					room.turn = 1;
					io.to(roomId).emit("start-game", room.turn);
					// ("start-game", turn:playerNumber);
				}
				broadcastRoomList(io);
			});

			// socket.on("put", ({ stone, roomId}: { stone: Stone, roomId: string }) => {
			socket.on("put", (stone: Stone, roomId: string) => {

				const room = rooms.get(roomId);
				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}, point: put`);
					console.log("error", `cannot find room : ${roomId}, point: put`);
					return;
				}
				if (room.players.get(socket.id) != room.turn) { return; }

				room.stones.push(stone);
				const lines = checkLines(room.stones);
				if (lines.length) {
					io.to(roomId).emit("finished-game", lines);
					console.log(`win pleyer: ${room.turn}`);
					console.log(lines);
				}

				room.turn = room.turn == 1 ? 2 : 1;
				io.to(roomId).emit("put", stone, room.turn);

			});

			socket.on("leave-room", (roomId: string) => {
				console.log("get leave-room event");
				const room = rooms.get(roomId);
				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}, point: leave-room`);
					console.log("error", `cannot find room : ${roomId}, point: leave-room`);
					return;
				}
				socket.leave(roomId);
				if (room.players.has(socket.id)) {
					io.to(roomId).emit("game-aborted",
						`player ${room.players.get(socket.id) == 1 ? 2 : 1} が退出したためゲームが中断されました`);
					rooms.delete(roomId);
					console.log("deleted room", roomId);
				}
				if (room.spectators.has(socket.id)) {
					room.spectators.delete(socket.id);
				}
				broadcastRoomList(io);
			})

			socket.on("room-list", () => {
				console.log("get room-list req");
				const roomList = Array.from(rooms.entries()).map(
					([roomId, room]) => ({
						id: roomId,
						players: room.players.size,
						spectators: room.spectators.size,
						playing: room.playing,
					})
				);
				socket.emit("room-list", roomList);
			});

			socket.on("disconnect", () => {
				console.log("client disconnected: ", socket.id);
				for (const [roomId, room] of rooms.entries()) {
					if (
						room.players.has(socket.id) ||
						room.spectators.has(socket.id)
					) {
						socket.leave(roomId);
						if (room.players.has(socket.id)) {
							io.to(roomId).emit("game-aborted",
								`player ${room.players.get(socket.id) == 1 ? 2 : 1} が退出したためゲームが中断されました`);
							rooms.delete(roomId);
							console.log("deleted room :", roomId);
						}
						if (room.spectators.has(socket.id)) {
							room.spectators.delete(socket.id);
						}

						break;
					}
				}
				broadcastRoomList(io);
			});

		});

		res.socket.server.io = io;
	}
	res.end();
}

function broadcastRoomList(io: Server) {
	const roomList = Array.from(rooms.entries()).map(
		([id, room]) => ({
			id,
			players: room.players.size,
			spectators: room.spectators.size,
			playing: room.playing,
		})
	);
	io.emit("room-list", roomList);
	console.log("broadcast room list");
}
