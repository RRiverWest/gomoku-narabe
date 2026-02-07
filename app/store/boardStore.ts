"use client"

import { create } from "zustand"

export interface Stone {
	x: number;
	y: number;
	color: "white" | "black";
}

export type Status = "waiting" | "playing" | "finished";

export interface RoomInfo {
	id: string;
	players: number; // 0,1,2
	spectators: number;
	staus: Status;
}

export type Turn = (1 | 2) | null;
export type Role = "player" | "spectactor" | null;

interface BoardStore {
	stones: Stone[],
	role: Role,
	playerNumber: (1 | 2 | null),
	turn: Turn;
	status: Status;
	linePoints: number[][];
	roomId: string | null;
	mode: ("online" | "offline");
	roomList: RoomInfo[];

	setStones: (newStones: Stone[]) => void;
	pushStone: (stone: Stone) => void;
	popStone: () => void;
	setRole: (role: Role, playerNumber: (1 | 2 | null)) => void;
	setTurn: (turn: Turn) => void;
	setLinePoints: (linesData: number[][]) => void;
	setRoomId: (id: string | null) => void;
	setMode: (mode: "online" | "offline") => void;
	setStatus: (s: Status) => void;
	setRoomList: (roomList: RoomInfo[]) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
	stones: [],
	role: null,
	playerNumber: null,
	turn: null,
	status: "waiting",
	linePoints: [],
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
	setRole: (r: Role, pn: (1 | 2 | null)) => {
		set(() => ({
			role: r,
			playerNumber: pn,
		}));
	},
	setTurn: (turn: Turn) => set(() => ({
		turn: turn,
	})),
	setLinePoints: (linesData) => set(() => ({
		linePoints: linesData,
	})),
	setRoomId: (id: string | null) => set(() => ({
		roomId: id,
	})),
	setMode: (mode: "online" | "offline") => {
		set(() => ({
			mode: mode,
		}));
	},
	setStatus: (s: Status) => set(() => ({
		status: s,
	})),
	setRoomList: (roomList: RoomInfo[]) => {
		set(() => ({
			roomList: roomList,
		}))
	},

}));
