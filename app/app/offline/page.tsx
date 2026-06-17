"use client"

import { useEffect } from "react"
import { useBoardStore } from "@/store/boardStore";
import OfflineBoard from "@/components/offline-board"
import StartButton from "@/components/startButton";
import { WaitButton } from "@/components/waitButton";
import { ResetButton } from "@/components/reset-button";
import { RoomStatusAlert } from "@/components/status-alert";
import { useRoomStatusStore } from "@/store/useRoomStatusStore";
import { GameAlert } from "@/components/game-alert"
import { useGameAlertStore } from "@/store/useGameAlertStore"

export default function OfflinePage() {

	const { setStatus, setStones, setTurn, setLinePoints, status, turn } = useBoardStore();
	useEffect(() => {
		setStatus("waiting");
		setStones([]);
		setTurn(null);
		setLinePoints([]);
		useGameAlertStore.getState().closeAlert();
	}, []);

	return (
		<div className="w-full flex items-center justify-center py-3">
			<GameAlert />
			<div className="object-center space-y-3">
				{status !== "playing" && (
					<StartButton />
				)}
				{status === "playing" && (
					<>
						<div className="flex justify-evenly">
							<WaitButton />
							<ResetButton />
						</div>
						<RoomStatusAlert />
					</>
				)}
				<OfflineBoard />
			</div>
		</div>
	);
}

