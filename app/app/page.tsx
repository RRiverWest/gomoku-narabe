"use client";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/store/socket";
import { useHomeSocketReceive } from "@/store/homeSocketReceive";
import RoomList from "@/components/room-list";
import { useBoardStore } from "@/store/boardStore";
import Link from "next/link";

export default function Home() {
	useHomeSocketReceive();
	const handleClick = () => {
		const socket = getSocket();
		socket.emit("make-room");
	};
	const { roomList } = useBoardStore();


	return (
		<div>
			<Button onClick={handleClick}>
				make room
			</Button>

			<Button>
				<Link href="/offline">
					オフライン対戦
				</Link>
			</Button>

			<RoomList rooms={roomList} />
		</div>
	);
}
