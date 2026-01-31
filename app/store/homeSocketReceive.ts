"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import { useBoardStore } from "@/store/boardStore";
import { useRouter } from "next/navigation";
import type { RoomInfo } from "@/store/boardStore";

export const useHomeSocketReceive = () => {

	const { setRoomList, roomList } = useBoardStore();
	const router = useRouter();
	const Events = [
		{
			name: "made-room",
			handler: (roomId: number) => {
				console.log("made room from server");
				router.push(`/room/${roomId}`)
			}
		},
		{
			name: "room-list",
			handler: (roomListData: RoomInfo[]) => {
				setRoomList(roomListData);
				console.log("update room list");
				console.log(roomList)
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
		socket.emit("room-list");

		return () => {
			Events.forEach(({ name, handler }) => {
				socket.off(name, handler);
			});
		};

	}, []);
};
