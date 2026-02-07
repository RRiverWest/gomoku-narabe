import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

const LeftGameStartButton = () => {
	const { setTurn, setStatus } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { setTurn(1); setStatus("playing"); }}>
			左プレイヤーからスタート!
		</Button>
	)
}
const RightGameStartButton = () => {
	const { setTurn, setStatus } = useBoardStore()
	return (
		<Button variant="default" onClick={() => { setTurn(2); setStatus("playing"); }}>
			右プレイヤーからゲームスタート!
		</Button>
	)
}
const StartButton = () => {
	return (
		<div>
			<LeftGameStartButton />
			<RightGameStartButton />
		</div>
	)
}
export default StartButton;
