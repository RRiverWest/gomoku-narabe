import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO
) {
	if (!res.socket.server.io) {
		console.log("Socket.IO server starting...");

		let nextRoomId = 1;
		type PlayerNumber = 1 | 2;
		interface RoomState {
			players: Map<string, PlayerNumber>;
			spectators: Set<string>;
			playing: boolean;
		}
		const rooms = new Map<number, RoomState>();

		const io = new Server(res.socket.server, {
			path: "/api/socket/io",
			addTrailingSlash: false,
		});

		io.on("connection", (socket) => {
			console.log("client connected: ", socket.id);

			socket.on("make-room", () => {
				const roomId = nextRoomId++;
				socket.join(roomId.toString());
				const room: RoomState = {
					players: new Map([[socket.id, 1]]),
					spectators: new Set(),
					playing: false,
				};
				rooms.set(roomId, room);
				// socket.emit("joind-room", "player", 1, "001");
				socket.emit("joind-room", "player", 1, roomId);
				console.log("get join-room event");
			});

			socket.on("join-room", (roomId: number) => {
				let role: "player" | "spectator";
				let playerNumber: 1 | 2 | null = null;
				let room = rooms.get(roomId);
				if (room) {

					if (room.players.size < 2) {
						playerNumber = room.players.has([...room.players.keys()][0]) ? 2 : 1;
						room.players.set(socket.id, playerNumber);
						role = "player";
					} else {
						room.spectators.add(socket.id);
						role = "spectator";
					}
					socket.join(roomId.toString());
					socket.emit("joind-room", role, playerNumber, roomId);
				}
				else {
					socket.emit("error", "cannot find room");
					return;
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
