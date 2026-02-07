import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGameAlertStore } from "@/store/useGameAlertStore";

export function GameAlert() {
  const { open, type, closeAlert } = useGameAlertStore();

  if (!type) return null;

  const config = {
    win: {
      title: "You Win!",
      description: "おめでとう！あなたの勝利です 🎉",
    },
    lose: {
      title: "You Lose",
      description: "残念…次は勝とう",
    },
    draw: {
      title: "Draw",
      description: "引き分けです",
    },
		retire: {
			title: "Retire",
			description: "相手がルームから退出しました"
		},
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
