"use client"

import { useEffect, use } from "react"
import { getSocket } from "@/store/socket";
import { StartButton } from "@/components/startButton";
import { Board } from "@/components/board";
import { useRoomSocketReceive } from "@/store/roomSocketReceive";

export default function Gomoku({ params }: { params: Promise<{ roomId: string }> }) {
	useRoomSocketReceive();

	const { roomId } = use(params);
	const socket = getSocket();
	useEffect(() => {
		socket.emit("join-room", { roomId });
		console.log("send join-room request");
		return () => {
			socket.emit("leave-room", { roomId });
		};
	}, [roomId]);

	return (
		<div>
			<p>Room Id: {roomId} </p>
			<StartButton />
			<Board />
		</div>
	);
}


