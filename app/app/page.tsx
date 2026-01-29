"use client";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/store/socket";
import { useHomeSocketReceive } from "@/store/homeSocketReceive"; 

export default function Home() {
	useHomeSocketReceive();
	const handleClick = () => {
		const socket = getSocket();
		socket.emit("make-room");
	};

	return (
		<div>
			<Button onClick={handleClick}>
				make room
			</Button>
		</div>
	);
}
