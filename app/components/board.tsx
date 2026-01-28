import Konva from "konva"
import { useRef, useState } from "react";

import {
	Stage,
	Layer,
	Circle,
	Line
} from "react-konva";
import { useBoardStore } from "@/store/boardStore";
import { checkLines } from "@/lib/check-lines";
import useWindowResize from "@/hooks/use-windown-resize"


export const linesQuantity = 15;

export const Board = () => {
	const { stones, pushStone: pushStones, turn, playing, toggleTurn, lines, setLines } = useBoardStore();
	const { height } = useWindowResize();
	const fieldSize = height * 0.7;
	const linesArray: number[] = [];
	const stageRef = useRef<Konva.Stage | null>(null);
	const stageSize = height * 0.8;
	const block = fieldSize / (linesQuantity - 1);
	const margin = height * 0.05;
	const [pointerPosition, setPointerPosition] = useState<{ x: number, y: number, visible: boolean, color: "black" | "white" | "red" }>(
		{ x: 0, y: 0, visible: false, color: "white" });

	// 横
	for (let i = 0; i < linesQuantity; i++) {
		if (i % 2 == 0) {
			linesArray.push(margin, margin + block * i, margin + fieldSize, margin + block * i);
		} else {
			linesArray.push(margin + fieldSize, margin + block * i, margin, margin + block * i);
		}
	}

	// 縦
	for (let i = linesQuantity - 1; i >= 0; i--) {
		if (i % 2 == 0) {
			linesArray.push(margin + block * i, margin + fieldSize, margin + block * i, margin);
		} else {
			linesArray.push(margin + block * i, margin, margin + block * i, margin + fieldSize);
		}
	}

	const checkError = (x: number, y: number): boolean => {
		for (let i = 0; i < stones.length; i++) {
			if (x == stones[i].x && y == stones[i].y) {
				return true;
			}
		}
		return false;
	};


	const handleMouseMove = () => {
		const cursorPosition = stageRef.current?.getPointerPosition();
		if (!cursorPosition) return;

		if (margin > cursorPosition.x || cursorPosition.x > margin + fieldSize ||
			margin > cursorPosition.y || cursorPosition.y > margin + fieldSize || playing == false) {
			// setPointerPosition({ x: 0, y: 0, visible: false, color: "green" })
			setPointerPosition({ ...pointerPosition, visible: false })
			return;
		}

		for (let xi = 0; xi < linesQuantity; xi++) {
			if (Math.abs(cursorPosition.x - (margin + block * xi)) < block / 2) {
				for (let yi = 0; yi < linesQuantity; yi++) {
					if (Math.abs(cursorPosition.y - (margin + block * yi)) < block / 2) {
						if (checkError(xi, yi)) {
							setPointerPosition({ x: xi, y: yi, visible: true, color: "red" });
							break;
						} else {
							setPointerPosition({ x: xi, y: yi, visible: true, color: turn == 1 ? "black" : "white" });
							break;
						}
					}
				}
			}
		}
	};

	const handleMouseDown = () => {

		const cursorPosition = stageRef.current?.getPointerPosition();
		if (!cursorPosition || pointerPosition.color == "red" || !playing) return;
		pushStones({ x: pointerPosition.x, y: pointerPosition.y, color: turn == 1 ? "black" : "white" });
		toggleTurn();
		setLines(checkLines().map(line => line.map(value => value * block + margin)));
		console.log(lines);
	};

	return (
		<Stage
			key={height}
			width={stageSize}
			height={stageSize}
			ref={stageRef}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
		>
			<Layer>
				<Line
					points={[0, 0, stageSize, 0,
						stageSize, 0, stageSize, stageSize,
						stageSize, stageSize, 0, stageSize,
						0, stageSize, 0, 0

					]}
					stroke="black"
					strokeWidth={5}
				/>

				<Line
					points={linesArray}
					stroke="black"
					strokeWidth={5}
				/>

				{stones.map(({ x, y, color }, i) => (
					<Circle
						key={i}
						x={block * x + margin}
						y={block * y + margin}
						radius={block * 0.5}
						fill={color}
						strokeWidth={1}
						stroke="black"
					/>
				))}
				{lines.map((value, index) => (
					<Line
						key={index}
						points={value}
						stroke="red"
						strokeWidth={10}
					/>
				)
				)}
				<Circle
					x={margin + block * pointerPosition.x}
					y={margin + block * pointerPosition.y}
					radius={block * 0.5}
					visible={pointerPosition.visible}
					fill={pointerPosition.color}
					strokeWidth={1}
					opacity={0.7}
					stroke="black"
				/>
			</Layer>
		</Stage >
	)
};
