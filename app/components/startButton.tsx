import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";
import { Activity } from "react";

const { setTurn, setStatus } = useBoardStore.getState();
const LeftGameStartButton = () => {
	return (
		<Button variant="default" onClick={() => { setTurn(1); setStatus("playing"); }}>
			左プレイヤーからスタート!
		</Button>
	)
}
const RightGameStartButton = () => {
	return (
		<Button variant="default" onClick={() => { setTurn(2); setStatus("playing"); }}>
			右プレイヤーからゲームスタート!
		</Button>
	)
}
const StartButton = () => {
	return (
		<div className="flex justify-evenly">
			<LeftGameStartButton />
			<RightGameStartButton />
		</div>
	)
}
export default StartButton;
