import { create } from "zustand";

export type StatusType = "wait"
	| "myTurn"
	| "enemyTurn"
	| "player1Turn"
	| "player2Turn"
	| "finished"
	| "error"
	| null;

interface RoomStatusState {
	type: StatusType;

	changeStatusWait: () => void;
	changeStatusMyTurn: () => void;
	changeStatusEnemyTurn: () => void;
	changeStatusPlayer1Turn: () => void;
	changeStatusPlayer2Turn: () => void;
	changeStatusFinished: () => void;
	changeStatusError: () => void;
}

export const useRoomStatusStore = create<RoomStatusState>((set) => ({
	type: null,
	open: false,

	changeStatusWait: () => set({ type: "wait" }),
	changeStatusMyTurn: () => set({ type: "myTurn" }),
	changeStatusEnemyTurn: () => set({ type: "enemyTurn" }),
	changeStatusPlayer1Turn: () => set({ type: "player1Turn" }),
	changeStatusPlayer2Turn: () => set({ type: "player2Turn" }),
	changeStatusFinished: () => set({ type: "finished" }),
	changeStatusError: () => set({type: "error"}),

}));

