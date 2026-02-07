import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGameAlertStore } from "@/store/useGameAlertStore";
import { Description } from "@radix-ui/react-dialog";

export function GameAlert() {
  const { open, type, closeAlert } = useGameAlertStore();

  if (!type) return null;

  const config = {
    win: {
      title: "You Win!",
      description: "おめでとう！あなたの勝利です!",
    },
		won1: {
			title: "Win Player 1",
			description: "プレイヤー１が勝利しました"
		},
		won2: {
			title: "Win Player 2",
			description: "プレイヤー2 が勝利しました"
		},
    lose: {
      title: "You Lose",
      description: "残念…次は勝とう",
    },
    draw: {
      title: "Draw",
      description: "引き分けです",
    },
		retireEnemy: {
			title: "Retire Enemy",
			description: "相手がルームから退出しました"
		},
		retire1: {
			title: "Retire Player 1",
			description : "プレイヤー１が退出しました"

		},
		retire2: {
			title: "Retire Player 2",
			description : "プレイヤー２が退出しました"

		}
  }[type];

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && closeAlert()}>
      <AlertDialogContent>
        <AlertDialogTitle>{config.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {config.description}
        </AlertDialogDescription>
        <AlertDialogAction onClick={closeAlert}>OK</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
