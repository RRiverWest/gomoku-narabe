import { create } from "zustand";

export type GameAlertType = "retire" | "win" | "lose" | "draw" | null;

interface GameAlertState {
	type: GameAlertType;
	open: boolean;

	showRetireAlert: () => void;
	showWinAlert: () => void;
	showLoseAlert: () => void;
	showDrawAlert: () => void;
	closeAlert: () => void;
}

export const useGameAlertStore = create<GameAlertState>((set) => ({
	type: null,
	open: false,

	showRetireAlert: () => set({ type: "retire", open: true }),
	showWinAlert: () => set({ type: "win", open: true }),
	showLoseAlert: () => set({ type: "lose", open: true }),
	showDrawAlert: () => set({ type: "draw", open: true }),
	closeAlert: () => set({ open: false, type: null }),
}));

