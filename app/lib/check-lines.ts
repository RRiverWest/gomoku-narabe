import { useBoardStore } from "@/store/boardStore";
import { linesQuantity } from "@/components/offline-board";
import type { Stone } from "@/store/boardStore";

export const checkLines = (stones: Stone[]): number[][] => {
	// const { stones } = useBoardStore.getState();
	const latestStone = stones[stones.length - 1];
	type Line = number[];
	type Lines = Line[];
	let line: Line = [];
	let lines: Lines = [];
	let boardState: ("black" | "white" | "none")[][] = [];

	for (let h = 0; h < linesQuantity; h++) {
		boardState[h] = [];
		for (let v = 0; v < linesQuantity; v++) {
			boardState[h][v] = "none";
		}
	}
	for (let i = 0; i < stones.length; i++) {
		boardState[stones[i].x][stones[i].y] = stones[i].color;
	}

	if (!latestStone) return lines;

	let horizontal: number;
	let vertical: number;

	let pointCount = 1;

	[[0, 1, 0, -1], [1, 0, -1, 0], [1, 1, -1, -1], [1, -1, -1, 1]].map((value) => {

		pointCount = 1;

		horizontal = value[0];
		vertical = value[1];
		while (boardState[latestStone.x + horizontal * pointCount][latestStone.y + vertical * pointCount] == latestStone.color) {
			line.push(latestStone.x + horizontal * pointCount, latestStone.y + vertical * pointCount);
			pointCount++;
		}

		pointCount = 1;

		horizontal = value[2];
		vertical = value[3];
		while (boardState[latestStone.x + horizontal * pointCount][latestStone.y + vertical * pointCount] == latestStone.color) {
			line.push(latestStone.x + horizontal * pointCount, latestStone.y + vertical * pointCount);
			pointCount++;
		}
		pointCount = 1;
		if (line.length >= 8) {
			line.push(latestStone.x, latestStone.y);
			lines.push(line);
		}
		line = [];

	})


	pointCount = 1;
	if (line.length >= 8) {
		line.push(latestStone.x, latestStone.y);
		lines.push(line);
	}
	line = [];

	return lines;
}
