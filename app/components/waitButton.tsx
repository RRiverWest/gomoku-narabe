import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

export const WaitButton = () => {
	const { popStone: popStones, setTurn, setLinePoints: setLines, turn } = useBoardStore()
	return (
		<Button variant="outline" onClick={() => {
			setTurn(turn == 1 ? 2 : 1);
			popStones();
			setLines([]);
		}}>
			ちょっと待った!
		</Button>
	)
}
