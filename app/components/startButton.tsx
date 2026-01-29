import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

const LeftGameStartButton = () => {
	const { setTurn, setPlaying } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { setTurn(1); setPlaying(true); }}>
			左プレイヤーからスタート!
		</Button>
	)
}
const RightGameStartButton = () => {
	const { setTurn, setPlaying } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { setTurn(2); setPlaying(true); }}>
			右プレイヤーからゲームスタート!
		</Button>
	)
}
export const StartButton = () => {
	return (
		<div>
			<LeftGameStartButton />
			<RightGameStartButton />
		</div>
	)
}
