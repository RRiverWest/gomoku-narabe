import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";

export const ResetButton = () => {
	const { setStones, setStatus, setTurn, setLinePoints } = useBoardStore();
	const handleClick = () => {
		setStones([]);
		setStatus("waiting");
		setTurn(null);
		setLinePoints([]);
	}

	return (
		<Button variant="destructive" onClick={handleClick}>
			Reset
		</Button>
	)
}
