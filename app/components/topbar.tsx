import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

export function Topbar() {
	return (
		<header
			className="
        relative
				py-3
        w-full
        bg-popover
        text-[var(--topbar-text)]
        border-b
      "
		>
			{/* 左側 */}
			<div className="flex place-self-center gap-3">
				<Button
					asChild
				>
					<Link href="/">
						<FaHome className="!h-7 !w-7" />
						<span className="text-lg font-semibold">
							みんなで五目並べ！
						</span>
					</Link>
				</Button>
				<ModeToggle />
			</div>
		</header>
	)
}
