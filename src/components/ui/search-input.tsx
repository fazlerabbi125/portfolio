"use client";

import { cn } from "cn";
import { Search } from "lucide-react";
import type { ComponentProps, KeyboardEvent } from "react";

type SearchInputProps = Omit<
	ComponentProps<"input">,
	"onChange" | "type" | "value"
> & {
	value: string;
	onValueChange: (value: string) => void;
	onSearch?: (value: string) => void;
	enableEnterPress?: boolean;
	"aria-label": string;
};

export function SearchInput({
	value,
	onValueChange,
	onSearch,
	enableEnterPress = false,
	onKeyDown,
	className,
	...props
}: Readonly<SearchInputProps>) {
	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(event);

		if (
			!event.defaultPrevented &&
			enableEnterPress &&
			onSearch &&
			event.key === "Enter"
		) {
			event.preventDefault();
			onSearch(value);
		}
	};

	return (
		<div className="relative">
			<Search
				size={16}
				className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<input
				{...props}
				type="search"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				onKeyDown={handleKeyDown}
				className={cn(
					"min-h-10 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
					className,
				)}
			/>
		</div>
	);
}
