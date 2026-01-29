"use client"

import { create } from "zustand"

export interface Stone {
	x: number;
	y: number;
	color: "white" | "black";
}
export type Turn = (1 | 2) | null;
export type Role = "player" | "spectactor" | null;

interface BoardStore {
	stones: Stone[],
	role: Role,
	playerNumber: (1 | 2 | null),
	turn: Turn;
	playing: boolean;
	lines: number[][];
	roomId: string | null;
	mode: ("online" | "offline");
	roomList: number[];

	setStones: (newStones: Stone[]) => void;
	pushStone: (stone: Stone) => void;
	popStone: () => void;
	setRole: (role: Role, playerNumber: (1 | 2 | null)) => void;
	setTurn: (turn: Turn) => void;
	setLines: (linesData: number[][]) => void;
	setRoomId: (id: string | null) => void;
	setMode: (mode: "online" | "offline") => void;
	setPlaying: (p: boolean) => void;
	setRoomList: (roomList: number[]) => void;

	reset: () => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
	stones: [],
	role: null,
	playerNumber: null,
	turn: null,
	playing: false,
	lines: [],
	roomId: null,
	mode: "offline",
	roomList: [],

	setStones: (newStones: Stone[]) => {
		set(() => ({
			stones: newStones,
		}))
	},
	pushStone: (stone: Stone) => {
		set((state) => ({ stones: [...state.stones, stone] }))
	},
	popStone: () => {
		if (get().stones.length) {
			set((state) => ({
				stones: state.stones.slice(0, -1),
			}));
		}
	},
	setRole: (role: Role, playerNumber: (1 | 2 | null)) => {
		set(() => ({
			role: role,
			playerNumber: playerNumber,
		}));
	},
	setTurn: (turn: Turn) => set(() => ({
		turn: turn,
	})),
	setLines: (linesData) => set(() => ({
		lines: linesData,
	})),
	setRoomId: (id: string | null) => set(() => ({
		roomId: id,
	})),
	setMode: (mode: "online" | "offline") => {
		set(() => ({
			mode: mode,
		}));
	},
	setPlaying: (p: boolean) => set(() => ({
		playing: p,
	})),
	setRoomList: (roomList: number[]) => {
		set(() => ({
			roomList: roomList,
		}))
	},

	reset: () => {
		set(() => ({
			stones: [],
			lines: [],
			roomId: null,
			playing: false,
			turn: null,
			rule: null,
			playerNumber: null,
		})
		)
	}
}));
