"use client";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/store/socket";
import { useHomeSocketReceive } from "@/store/homeSocketReceive";
import RoomList from "@/components/room-list";
import { useBoardStore } from "@/store/boardStore";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { TbWorldOff } from "react-icons/tb";

export default function Home() {
	useHomeSocketReceive();
	const socket = getSocket();
	const { roomList } = useBoardStore();

	return (

		<div>
			<div className="w-full flex justify-center mt-10">
				<div className="flex gap-6">
					<Button
						className="h-16 w-70 text-2xl font-semibold"
						onClick={() => { socket.emit("make-room"); }}
					>
						<PlusCircle className="!h-10 !w-10" />
						ルーム作成
					</Button>
					<Link href="/offline">
						<Button
							className="font-semibold h-16 w-70 border border-border"
						>
							<TbWorldOff className="!h-10 !w-10" />
							<p className="text-2xl">
								オフライン対戦
							</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className="mt-10 border border-border m-10 p-5 rounded-2xl">
				<RoomList rooms={roomList} />
			</div>
		</div>
	);
}
