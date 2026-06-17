import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";
import { useRoomStatusStore } from "@/store/useRoomStatusStore"

const { setTurn, setStatus } = useBoardStore.getState();

const LeftGameStartButton = () => {
	return (
		<Button variant="default" onClick={() => {
			setTurn(1);
			setStatus("playing");
			useRoomStatusStore.getState().changeStatusLeftTurn();
		}}>
			左プレイヤーからスタート!
		</Button>
	)
}
const RightGameStartButton = () => {
	return (
		<Button variant="default" onClick={() => { 
			setTurn(2); 
			setStatus("playing"); 
			useRoomStatusStore.getState().changeStatusRightTurn();
		}}>
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
