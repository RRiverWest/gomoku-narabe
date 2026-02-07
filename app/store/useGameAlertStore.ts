import { create } from "zustand";

export type GameAlertType = "retireEnemy" | "retire1" | "retire2" | "win" | "won1" | "won2" | "lose" | "draw" | null;

interface GameAlertState {
	type: GameAlertType;
	open: boolean;

	showRetireEnemyAlert: () => void;
	showRetire1Alert: () => void;
	showRetire2Alert: () => void;
	showWinAlert: () => void;
	showWon1Alert: () => void;
	showWon2Alert: () => void;
	showLoseAlert: () => void;
	showDrawAlert: () => void;
	closeAlert: () => void;
}

export const useGameAlertStore = create<GameAlertState>((set) => ({
	type: null,
	open: false,

	showRetireEnemyAlert: () => set({ type: "retireEnemy", open: true }),
	showRetire1Alert: () => set({ type: "retire1", open: true }),
	showRetire2Alert: () => set({ type: "retire2", open: true }),
	showWinAlert: () => set({ type: "win", open: true }),
	showWon1Alert: () => set({ type: "won1", open: true }),
	showWon2Alert: () => set({ type: "won2", open: true }),
	showLoseAlert: () => set({ type: "lose", open: true }),
	showDrawAlert: () => set({ type: "draw", open: true }),
	closeAlert: () => set({ open: false, type: null }),
}));

