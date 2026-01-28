import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

export const WaitButton = () => {
	const { popStone: popStones, toggleTurn, setLines } = useBoardStore()
	return (
		<Button variant="outline" onClick={() => {
			toggleTurn();
			popStones();
			setLines([]);
		}}>
			ちょっと待った!
		</Button>
	)
}
