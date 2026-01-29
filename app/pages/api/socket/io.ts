import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";

let nextRoomId = 1;
type PlayerNumber = 1 | 2;
interface RoomState {
	players: Map<string, PlayerNumber>;
	spectators: Set<string>;
	playing: boolean;
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
					io.to(roomId).emit("start-game", 1, roomId);
					// ("start-game", turn:playerNumber, roomId);
				}
			})

			socket.on("disconnect", () => {
				console.log("client disconnected");
			});

			socket.on("changeMode", (mode: "online" | "offline") => {
				socket.emit("changedMode", mode);
				console.log("change mode to", mode);
			})
		});

		res.socket.server.io = io;
	}
	res.end();
}
