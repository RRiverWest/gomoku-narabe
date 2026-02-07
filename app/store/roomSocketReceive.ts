"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import { useBoardStore } from "@/store/boardStore";
import type { Stone, Turn, Role, Status } from "./boardStore"
import { useGameAlertStore } from "./useGameAlertStore";
import { useRoomStatusStore } from "./useRoomStatusStore";

export const useRoomSocketReceive = () => {

	const { setTurn, pushStone, setStatus,
		setLinePoints, setStones, setRole, setRoomId } = useBoardStore();
	const { changeStatusWait, changeStatusMyTurn,
		changeStatusEnemyTurn, changeStatusFinished, changeStatusPlayer1Turn,
		changeStatusPlayer2Turn, changeStatusError } = useRoomStatusStore();
	const { showWinAlert, showWon1Alert, showWon2Alert, showLoseAlert, showRetireEnemyAlert,
		showRetire1Alert, showRetire2Alert } = useGameAlertStore();
	const Events = [
		{
			name: "joined-room",
			handler: (r: Role, pn: 1 | 2 | null, roomId: string) => {
				setRoomId(roomId);
				setRole(r, pn);
				console.log(`joined-room id:${roomId}, role:${r}, player number: ${pn} `);
			}
		},
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
			name: "win",
			handler: (t: Turn, lines: number[][]) => {
				setLinePoints(lines);
				setStatus("finished");
				changeStatusFinished();
				if (useBoardStore.getState().role == "player") {
					if (useBoardStore.getState().playerNumber == t) {
						showWinAlert();
					} else {
						showLoseAlert();
					}
				}else {
					if (t == 1) {
						showWon1Alert();
					}else {
						showWon2Alert();
					}
				}
			}
		},
		{
			name: "retire",
			handler: (playerNumber: number) => {
				console.log(`retire player: ${playerNumber}`)
				if (useBoardStore.getState().role === "player") {
					showRetireEnemyAlert();
				}
				else {
					if (playerNumber == 1) {
						showRetire1Alert();
						console.log("retire 1");
					} else {
						showRetire2Alert();
						console.log("retire 2");
					}
				}
			}
		},
		{
			name: "finished",
			handler: () => {
				setStatus("finished");
				changeStatusFinished();
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
