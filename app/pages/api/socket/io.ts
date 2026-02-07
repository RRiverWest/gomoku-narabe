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
	status: "waiting" | "playing" | "finished";
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
					status: "waiting",
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
				let playerNumber: 1 | 2 | null;
				let room = rooms.get(roomId);

				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}, pint: join-room`);
					console.log("error", `cannot find room : ${roomId}, pint: join-room`);
					return;
				}

				if (room.players.has(socket.id) || room.spectators.has(socket.id)) { return; }

				if (room.players.size < 2) {
					playerNumber = (!room.players.size) ? 1 : 2;
					room.players.set(socket.id, playerNumber);
					role = "player";
				} else {
					playerNumber = null;
					room.spectators.add(socket.id);
					role = "spectator";
				}
				socket.join(roomId);
				socket.emit("joined-room", role, playerNumber, roomId);
				console.log(`joined new client${socket.id} to room: ${roomId}`);
				broadcastRoomList(io);

				if (playerNumber == 2) {
					room.turn = 1;
					io.to(roomId).emit("start-game", 1);
					room.status = "playing";
					console.log(`start-game in :${roomId}`);
					io.to(roomId).emit("now-status", room.stones, room.turn, room.status);
					// ("start-game", turn:playerNumber);
				}
				socket.emit("now-status", room.stones, room.turn, room.status);
				console.log("send now-status :", roomId);
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
				room.turn = room.turn == 1 ? 2 : 1;
				io.to(roomId).emit("update", stone, room.turn);

				const lines = checkLines(room.stones);
				if (lines.length) {
					io.to(roomId).emit("win", room.players.get(socket.id), lines);
					rooms.delete(roomId);
					console.log(`win pleyer: ${room.turn}`);
					console.log(lines);
				}


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
					io.to(roomId).emit("retire", room.players.get(socket.id));
					io.to(roomId).emit("finished");
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
						status: room.status,
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
							io.to(roomId).emit("retire", room.players.get(socket.id));
							io.to(roomId).emit("finished");
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
			status: room.status,
		})
	);
	io.emit("room-list", roomList);
	console.log("broadcast room list");
}
