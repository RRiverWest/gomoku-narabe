"use client"

import { useEffect } from "react"
import { useBoardStore } from "@/store/boardStore";
import OfflineBoard from "@/components/offline-board"
import StartButton from "@/components/startButton";

export default function OfflinePage() {

	const { setPlaying, setStones, setTurn, setLinePoints } = useBoardStore();
	useEffect(() => {
		return () => {
			setPlaying(false);
			setStones([]);
			setTurn(null);
			setLinePoints([]);
		};
	}, []);

	return (
		<div>
			<StartButton />
			<OfflineBoard />
		</div>
	);
}

