"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import { useBoardStore } from "@/store/boardStore";
import type { Stone, Turn, Role } from "./boardStore"

export const useRoomSocketReceive = () => {

	const socket = useBoardStore();
	const Events = [
		{
			name: "joined-room",
			handler: (role: Role, playerNumber: 1 | 2 | null, roomId: string) => {
				socket.setRoomId(roomId);
				socket.setRole(role, playerNumber);
				console.log("room joined: ", role, playerNumber, roomId);
				console.log(socket.roomId, socket.role, socket.playerNumber);
			}
		},
		{
			name: "update",
			handler: (stone: Stone, turn: Turn) => {
				socket.pushStone(stone);
				socket.setTurn(turn);
			}
		},
		{
			name: "now-status",
			handler: (stones: Stone[], turn: Turn, playing: boolean, lines: number[][]) => {
				socket.setStones(stones);
				socket.setTurn(turn);
				socket.setLines(lines);
				socket.setPlaying(playing);
			}
		},
		{
			name: "error",
			handler: (errorMessage: string) => {
				console.log(`error: ${errorMessage}`);
			}
		},
	];

	useEffect(() => {
		const socket = getSocket();

		Events.forEach(({ name, handler }) => {
			socket.on(name, handler);
		});

		return () => {
			Events.forEach(({ name, handler }) => {
				socket.off(name, handler);
			});
		};

	}, []);
};
