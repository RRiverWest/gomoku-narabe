"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Play } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import type { RoomInfo } from "@/store/boardStore"


export default function RoomList({ rooms }: { rooms: RoomInfo[] }) {
	const router = useRouter();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{rooms.map(room => (
				<Card key={room.id} className="rounded-2xl shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-lg">Room #{room.id}</CardTitle>
						{room.staus == "playing" ? (
							<Badge variant="destructive">Playing</Badge>
						) : (
							<Badge variant="secondary">Waiting</Badge>
						)}
					</CardHeader>

					<CardContent className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-1">
								<Users size={16} />
								<span>{room.players}/2 players</span>
							</div>
							<div className="flex items-center gap-1">
								<Eye size={16} />
								<span>{room.spectators}</span>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								className="flex-1"
								onClick={() => {
									router.push(`/room/${room.id}`);
									console.log("clicked join-room : ", room.id)
								}
								}
							>
								<Play className="mr-1 h-4 w-4" />
								join
							</Button>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
