"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="secondary"
					className="
				rounded-full
				shadow-sm
				relative
				border border-accent 
				bg-background
				hover:bg-accent
		  "
				>
					<Sun
						className="
        h-5 w-5
        sm:h-6 sm:w-6
        lg:h-7 lg:w-7
        transition-all
        dark:scale-0 dark:-rotate-90
      "
					/>
					<Moon
						className="
        absolute
        h-5 w-5
        sm:h-6 sm:w-6
        lg:h-7 lg:w-7
        transition-all
        scale-0 rotate-90
        dark:scale-100 dark:rotate-0
      "
					/>
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
