import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";
import type { Stone } from "@/store/boardStore";
import { checkLines } from "@/lib/check-lines";

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
				// socket.emit("joind-room", "player", 1, "001");
				socket.emit("made-room", roomId);
				console.log(`made room from ${socket.id}, roomId: ${roomId}`);
			});

			socket.on("join-room", ({ roomId }: { roomId: string }) => {
				let role: "player" | "spectator";
				let playerNumber: 1 | 2 | null = null;
				let room = rooms.get(roomId);

				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}`);
					console.log("error", `cannot find room : ${roomId}`);
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
			});

			// socket.on("put", ({ stone, roomId}: { stone: Stone, roomId: string }) => {
			socket.on("put", (stone: Stone, roomId: string) => {

				let room = rooms.get(roomId);
				if (!room) {
					socket.emit("error", `cannot find room : ${roomId}`);
					console.log("error", `cannot find room : ${roomId}`);
					return;
				}
				if (room.players.get(socket.id) != room.turn) { return; }
				room.stones.push(stone);
				room.turn = room.turn == 1 ? 2 : 1;
				io.to(roomId).emit("put", stone, room.turn);
				// let lines = checkLines(room.stones);

			});


			socket.on("disconnect", () => {
				console.log("client disconnected");
			});

		});

		res.socket.server.io = io;
	}
	res.end();
}
