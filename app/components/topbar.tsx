import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

export function Topbar() {
	return (
		<header
			className="
        relative
        flex items-center
				justify-between
				py-3
        w-full
        px-3 sm:px-6
        bg-[var(--topbar-bg)]
        text-[var(--topbar-text)]
        border-b
      "
		>
			{/* 左側 */}
			<div className="flex place-items-center gap-3">
				<Button
					variant="outline"
					asChild
				>
					<Link href="/">
						<FaHome className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
						<span className="text-sm sm:text-base lg:text-lg font-semibold">
							みんなで五目並べ！
						</span>
					</Link>
				</Button>
				<ModeToggle />
			</div>
		</header>
	)
}
