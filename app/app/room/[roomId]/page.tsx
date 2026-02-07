"use client"

import { useEffect, use } from "react"
import { getSocket } from "@/store/socket";
import { useRoomSocketReceive } from "@/store/roomSocketReceive";
import { useBoardStore } from "@/store/boardStore";
import OnlineBoard from "@/components/online-board";
import { GameAlert } from "@/components/game-alert";
import { RoomStatusAlert } from "@/components/status-alert";

export default function Gomoku({ params }: { params: Promise<{ roomId: string }> }) {
	useRoomSocketReceive();

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
			<GameAlert />
			<div className="object-center">
				<RoomStatusAlert />
				<h3 className="text-2xl">Room Id: {roomId} </h3>
				<OnlineBoard />
			</div>
		</div>
	);
}

