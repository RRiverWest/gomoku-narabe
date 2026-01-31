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
		<div className="w-full flex items-center justify-center">
			<div className="object-center">
				<h3 className="text-2xl">Room Id: {roomId} </h3>
				<h3 className="text-2xl">You: {playing} </h3>
				<h3 className="text-2xl">turn: {turn}</h3>
				<OnlineBoard />
			</div>
		</div>
	);
}

