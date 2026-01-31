"use client"

import { useEffect, use } from "react"
import { getSocket } from "@/store/socket";
import { useRoomSocketReceive } from "@/store/roomSocketReceive";
import { useBoardStore } from "@/store/boardStore";
import OnlineBoard from "@/components/online-board";

export default function Gomoku({ params }: { params: Promise<{ roomId: string }> }) {
	useRoomSocketReceive();

	const { turn, playing } = useBoardStore();
	const { roomId } = use(params);
	const socket = getSocket();
	useEffect(() => {
		socket.emit("join-room", roomId);
		console.log("send join-room request");
		return () => {
			socket.emit("leave-room", roomId);
		};
	}, [roomId]);

	return (
		<div>
			<p>Room Id: {roomId} </p>
			<p>status: {playing} </p>
			<p>turn: {turn}</p>
			<OnlineBoard />
		</div>
	);
}

