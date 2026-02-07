"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import { useBoardStore } from "@/store/boardStore";
import type { Stone, Turn, Role, Status } from "./boardStore"
import { handler } from "next/dist/build/templates/app-page";
import { useGameAlertStore } from "./useGameAlertStore";
import { useRoomStatusStore } from "./useRoomStatusStore";

export const useRoomSocketReceive = () => {

	const { setTurn, pushStone, setStatus,
		setLinePoints, setStones, setRole, setRoomId} = useBoardStore();
	const { changeStatusWait, changeStatusMyTurn,
		changeStatusEnemyTurn, changeStatusFinished, changeStatusPlayer1Turn,
		changeStatusPlayer2Turn, changeStatusError } = useRoomStatusStore();
	const { showWinAlert, showRetireAlert } = useGameAlertStore();
	// const socket = useBoardStore();
	const Events = [
		{
			name: "joined-room",
			handler: (r: Role, pn: 1 | 2 | null, roomId: string) => {
				setRoomId(roomId);
				setRole(r, pn);
				console.log(`joined-room id:${roomId}, role:${r}, player number: ${pn} `);
			}
		},
		// {
		// 	name: "update",
		// 	handler: (stone: Stone, turn: Turn) => {
		// 		pushStone(stone);
		// 		setTurn(turn);
		// 	}
		// },
		{
			name: "now-status",
			handler: (stones: Stone[], turn: Turn, status: Status) => {
				console.log(`now-status, turn: ${turn}, status:${status}, stones:${stones}`);
				setStones(stones);
				setTurn(turn);
				setStatus(status);
				if (status == "waiting") {
					changeStatusWait();
					return;
				} else if (status == "finished") {
					changeStatusFinished();
					return;
				}
				if (useBoardStore.getState().role === "player") {
					if (turn == useBoardStore.getState().playerNumber) {
						changeStatusMyTurn();
					} else {
						changeStatusEnemyTurn();
					}
					return;
				}
				switch (turn) {
					case 1:
						changeStatusPlayer1Turn();
						break;
					case 2:
						changeStatusPlayer2Turn();
						break;
				}
			}
		},
		{
			name: "start-game",
			handler: (turn: Turn) => {
				setStatus("playing");
				setTurn(turn);
				console.log("game start!");
			}
		},
		{
			name: "update",
			handler: (stone: Stone, turn: Turn) => {
				pushStone(stone);
				setTurn(turn);
				console.log(`update, turn:${turn}`);

				if (useBoardStore.getState().role === "player") {
					if (turn == useBoardStore.getState().playerNumber) {
						changeStatusMyTurn();
					} else {
						changeStatusEnemyTurn();
					}
					return;
				}
				switch (turn) {
					case 1:
						changeStatusPlayer1Turn();
						break;
					case 2:
						changeStatusPlayer2Turn();
						break;
				}

			}
		},
		{
			name: "finished-game",
			handler: (lines: number[][]) => {
				setLinePoints(lines);
				setStatus("finished");
			}
		},
		{
			name: "retire",
			handler: (playerNumber: number) => {
				showRetireAlert();
			}
		},
		{
			name: "error",
			handler: (errorMessage: string) => {
				console.log(`error: ${errorMessage}`);
				changeStatusError();
			}
		},
	];

	useEffect(() => {
		const socket = getSocket();

		Events.forEach(({ name, handler }) => {
			socket.on(name, handler);
		});

		return () => {
			Events.forEach(({ name, handler }) => {
				socket.off(name, handler);
			});
		};

	}, []);
};
