import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

const LeftGameStartButton = () => {
	const { startGame } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { startGame(1); }}>
			左プレイヤーからスタート!
		</Button>
	)
}
const RightGameStartButton = () => {
	const { startGame } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { startGame(2); }}>
			右プレイヤーからゲームスタート!
		</Button>
	)
}
export const GameStartButton = () => {
	return (
		<div>
			<LeftGameStartButton />
			<RightGameStartButton />
		</div>
	)
}
