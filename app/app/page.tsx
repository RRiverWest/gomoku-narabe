"use client"

import { Board } from "@/components/board"
import { GameStartButton } from "@/components/startButton"
import { WaitButton } from "@/components/waitButton"
import { Activity } from "react"
import { useBoardStore } from "@/store/boardStore"
import { Button } from "@/components/ui/button"
import { getSocket } from "@/store/socket"
import { useSocketReceive } from "@/store/socketReceive"

export default function Home() {
	const { playing } = useBoardStore();
	const handleClick = () => {
		const socket = getSocket();
		socket.emit("make-room");
	}
	useSocketReceive();


	return (
		<div>
			<Activity mode={playing ? "visible" : "hidden"}>
				<WaitButton />
			</Activity>
			<Activity mode={playing ? "hidden" : "visible"}>
				<GameStartButton />
			</Activity>
			<Board />
			<Button onClick={handleClick}>
				make room
			</Button>
			<p>Room Id : {useBoardStore().roomId}</p>
		</div>
	)
}
