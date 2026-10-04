"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const initialQuery = searchParams.get("search") || "";
	const [query, setQuery] = useState(initialQuery);

	const handleSearch = (searchTerm: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (searchTerm.trim()) {
			params.set("search", searchTerm.trim());
			params.set("page", "1");
		} else {
			params.delete("search");
			params.set("page", "1");
		}

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`);
		});
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		handleSearch(query);
	};

	const handleClear = () => {
		setQuery("");
		handleSearch("");
	};

	return (
		<search className="w-full max-w-md">
			<form
				onSubmit={handleSubmit}
				className="relative flex items-center w-full"
			>
				<Search
					size={16}
					className="absolute left-3 text-muted-foreground pointer-events-none"
					aria-hidden="true"
				/>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search posts by title or content…"
					className="w-full pl-9 pr-20 py-2 rounded-lg border border-border bg-surface text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
					aria-label="Search blog posts"
				/>
				<div className="absolute right-1.5 flex items-center gap-1">
					{query && (
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={handleClear}
							aria-label="Clear search"
						>
							<X size={14} />
						</Button>
					)}
					<Button
						type="submit"
						size="sm"
						variant="outline"
						className="h-7 px-2 text-xs"
						disabled={isPending}
					>
						Search
					</Button>
				</div>
			</form>
		</search>
	);
}
