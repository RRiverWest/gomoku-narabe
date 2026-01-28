"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import { useBoardStore } from "@/store/boardStore";
import type { Stone, Turn, Role } from "./boardStore"
import { handler } from "next/dist/build/templates/app-page";


export const useSocketReceive = () => {

	const socket = useBoardStore();
	const Events = [
		{
			name: "joind-room",
			handler: (role: Role, playerNumber: 1 | 2 | null, roomId: number) => {
				socket.setRoomId(roomId);
				socket.setRole(role, playerNumber);
				console.log("room joid: ", role, playerNumber, roomId);
				console.log(socket.roomId, socket.role);
			}
		},
		{
			name: "update",
			handler: (stone: Stone, turn: Turn, lines: number[][]) => {
				socket.pushStone(stone);
				socket.setTurn(turn);
				socket.setLines(lines);
			}
		},
		{
			name: "rival-disconnected",
			handler: () => {
				socket.reset();
			}
		},
		{
			name: "exited-room",
			handler: () => {
				socket.reset();
			}
		},
		{
			name: "room-list",
			handler: (roomList: number[]) => {
				socket.setRoomList(roomList);
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
