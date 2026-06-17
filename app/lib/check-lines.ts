import { linesQuantity } from "@/lib/constants";
import type { Stone } from "@/store/boardStore";

export const checkLines = (stones: Stone[]): number[][] => {
	// const { stones } = useBoardStore.getState();
	const latestStone = stones[stones.length - 1];
	let line: number[] = [];
	let lines: number[][] = [];
	let boardState: ("black" | "white" | "none")[][] = [];

	for (let v = 0; v < linesQuantity; v++) {
		boardState[v] = [];
		for (let h = 0; h < linesQuantity; h++) {
			boardState[v][h] = "none";
		}
	}
	for (let i = 0; i < stones.length; i++) {
		boardState[stones[i].y][stones[i].x] = stones[i].color;
	}

	if (!latestStone) return lines;

	let pointCount = 1;

	[[0, 1, 0, -1], [1, 0, -1, 0], [1, 1, -1, -1], [1, -1, -1, 1]].forEach(value => {

		pointCount = 1;
		while (true) {

			const x = latestStone.x + value[0] * pointCount;
			const y = latestStone.y + value[1] * pointCount;
			if (x < 0 || x >= linesQuantity || y < 0 || y >= linesQuantity || boardState[y][x] != latestStone.color) {
				break;
			}
			line.push(x, y);
			pointCount++;

		}

		pointCount = 1;
		while (true) {

			const x = latestStone.x + value[2] * pointCount;
			const y = latestStone.y + value[3] * pointCount;
			if (x < 0 || x >= linesQuantity || y < 0 || y >= linesQuantity || boardState[y][x] != latestStone.color) {
				break;
			}
			line.push(x, y);
			pointCount++;

		}

		if (line.length >= 4 * 2) {
			line.push(latestStone.x, latestStone.y);
			lines.push(line);
		}
		line = [];

	})

	return lines;
}
