"use client"

import { Activity, useEffect } from "react"
import { useBoardStore } from "@/store/boardStore";
import OfflineBoard from "@/components/offline-board"
import StartButton from "@/components/startButton";
import { WaitButton } from "@/components/waitButton";
import { ResetButton } from "@/components/reset-button";
import { RoomStatusAlert } from "@/components/status-alert";
import { useRoomStatusStore } from "@/store/useRoomStatusStore";

export default function OfflinePage() {

	const { setStatus, setStones, setTurn, setLinePoints, status, turn } = useBoardStore();
	const { changeStatusRightTurn, changeStatusLeftTurn } = useRoomStatusStore();
	useEffect(() => {
		setStatus("waiting");
		setStones([]);
		setTurn(null);
		setLinePoints([]);
	}, []);

	useEffect(() => {
		switch (turn) {
			case 1: changeStatusLeftTurn();
				break;
			case 2: changeStatusRightTurn();
		}
	}, [turn])

	return (
		<div className="w-full flex items-center justify-center py-3">
			<div className="object-center space-y-3">
				<Activity mode={status == "playing" ? "hidden" : "visible"}>
					<StartButton />
				</Activity>
				<Activity mode={status != "playing" ? "hidden" : "visible"}>
					<div className="flex justify-evenly">
						<WaitButton />
						<ResetButton />
					</div>
					<RoomStatusAlert />
				</Activity>
				<OfflineBoard />
			</div>
		</div>
	);
}

