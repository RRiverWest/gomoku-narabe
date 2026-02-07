import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"
import { Spinner } from "./ui/spinner";
import { useRoomStatusStore } from "@/store/useRoomStatusStore"
import { ReactElement } from "react";
import type { StatusType } from "@/store/useRoomStatusStore"
import { FaCircle } from "react-icons/fa";
import { useBoardStore } from "@/store/boardStore";
import { FaFlagCheckered } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";

interface Config {
	title: string,
	description: string,
	component: ReactElement,
}

export const RoomStatusAlert = () => {
	const { type } = useRoomStatusStore();
	const { playerNumber, turn } = useBoardStore();

	const configMap = new Map<StatusType, Config>([

		["wait", {
			title: "待機中",
			description: "対戦相手を募集中",
			component: <Spinner />
		}],

		["myTurn", {
			title: "あなたのターン",
			description: "石をおいてね",
			component: <FaCircle color={playerNumber == 1 ? "black" : "white"} />
		}],
		["enemyTurn", {
			title: "相手のターン",
			description: "思考中",
			component: <FaCircle color={playerNumber == 1 ? "white" : "black"} />
		}],
		["leftTurn", {
			title: "左プレイヤーのターン",
			description: "石をおいてね",
			component: <FaCircle color="white" />
		}],
		["rightTurn", {
			title: "右プレイヤーのターン",
			description: "石をおいてね",
			component: <FaCircle color="black" />
		}],
		["player1Turn", {
			title: "プレイヤー１のターン",
			description: "思考中",
			component: <FaCircle color="black" />
		}],
		["player2Turn", {
			title: "プレイヤー２のターン",
			description: "思考中",
			component: <FaCircle color="white" />
		}],
		["finished", {
			title: "ゲームは終了しました",
			description: "ホームボタンを押してロビーへ",
			component: <FaFlagCheckered />
		}],
		["error", {
			title: "エラー",
			description: "ホームボタンを押してーロビーへ",
			component: <MdOutlineErrorOutline color="red" />
		}],

	]);

	// {
	// 	wait: {
	// 		title: "待機中",
	// 			description: "対戦相手を募集中",
	// 		},
	// 	myTurn: {
	// 		title: "あなたのターン",
	// 			description: "石をおいてね",
	// 		},
	// 	enemyTurn: {
	// 		title: "相手のターン",
	// 			description: "思考中",
	// 		},
	// 	player1Turn: {
	// 		title: "プレイヤー１のターン",
	// 			Description: "思考中",
	// 		},
	// 	player2Turn: {
	// 		title: "プレイヤー２のターン",
	// 			Description: "思考中",
	// 		},
	// 	finished: {
	// 		title: "ゲームは終了しました",
	// 			description: "ホームボタンを押してロビーへ"
	// 	},
	//
	// };

	const config = configMap.get(type);
	if (!config) return null;

	return (
		<Alert>
			{config.component}
			<AlertTitle>{config.title}</AlertTitle>
			<AlertDescription>
				{config.description}
			</AlertDescription>
		</Alert>
	);

	// return (
	// 	<Alert>
	// 		<Spinner />
	// 		<AlertTitle>Hello</AlertTitle>
	// 		<AlertDescription>
	// 		Test
	// 		</AlertDescription>
	// 	</Alert>
	// );

};
