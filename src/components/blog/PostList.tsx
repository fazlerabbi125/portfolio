"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	type SubmitEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { getFavoritePosts, getPosts } from "@/actions/blog.action";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { BlogPostListItem } from "@/types/blog";
import "./PostList.css";

interface Category {
	id: number;
	name: string;
	description?: string | null;
}

interface PostListProps {
	posts: BlogPostListItem[];
	total: number;
	totalPages: number;
	currentPage: number;
	categories: Category[];
	mode?: "blog" | "favorites";
}

export default function PostList({
	posts,
	total,
	totalPages,
	currentPage,
	categories,
	mode = "blog",
}: Readonly<PostListProps>) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [category, setCategory] = useState(searchParams.get("category") ?? "");
	const [loadedPosts, setLoadedPosts] = useState(posts);
	const [loadedPage, setLoadedPage] = useState(currentPage);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const isFetchingRef = useRef(false);

	useEffect(() => {
		setLoadedPosts(posts);
		setLoadedPage(currentPage);
	}, [currentPage, posts]);

	useEffect(() => {
		setSearch(searchParams.get("search") ?? "");
		setCategory(searchParams.get("category") ?? "");
	}, [searchParams]);

	const handleFilterSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const params = new URLSearchParams();
		const trimmedSearch = search.trim();

		if (trimmedSearch) params.set("search", trimmedSearch);
		if (category) params.set("category", category);

		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname);
	};

	const handleFilterReset = () => {
		setSearch("");
		setCategory("");
		setLoadedPosts(posts);
		setLoadedPage(currentPage);
		router.push(pathname);
	};

	const loadMorePosts = useCallback(async () => {
		// An observer can fire again before state updates, so keep a synchronous guard.
		if (isFetchingRef.current || loadedPage >= totalPages) return;

		isFetchingRef.current = true;
		setIsLoadingMore(true);
		try {
			const query = {
				categoryId: Number(searchParams.get("category")) || undefined,
				page: loadedPage + 1,
				search: searchParams.get("search") ?? "",
			};
			const result =
				mode === "favorites"
					? await getFavoritePosts(query)
					: await getPosts(query);
			setLoadedPosts((current) => {
				const knownIds = new Set(current.map((post) => post.id));
				return [
					...current,
					...result.posts.filter((post) => !knownIds.has(post.id)),
				];
			});
			setLoadedPage(result.currentPage);
		} finally {
			isFetchingRef.current = false;
			setIsLoadingMore(false);
		}
	}, [loadedPage, mode, searchParams, totalPages]);

	useInfiniteScroll(loadMoreRef, loadMorePosts);

	return (
		<>
			<form
				className="mb-[4rem] flex flex-wrap items-center justify-center gap-3 px-4 sm:justify-end"
				onSubmit={handleFilterSubmit}
				onReset={handleFilterReset}
			>
				<div className="w-100 max-w-[20rem]">
					<SearchInput
						value={search}
						onValueChange={setSearch}
						aria-label="Search posts by title or content"
						title="Search posts by title or content"
						placeholder="Search posts by title or content…"
						className="max-w-md"
					/>
				</div>
				<select
					id="blog-category"
					aria-label="Filter posts by category"
					value={category}
					onChange={(event) => setCategory(event.target.value)}
					className="min-h-10 w-full max-w-xs rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
				>
					<option value="">All categories</option>
					{categories.map((item) => (
						<option key={item.id} value={item.id}>
							{item.name}
						</option>
					))}
				</select>
				<fieldset className="flex shrink-0 flex-nowrap gap-2">
					<legend className="sr-only">Blog filter actions</legend>
					<Button type="reset" variant="outline">
						Reset
					</Button>
					<Button type="submit">Search</Button>
				</fieldset>
			</form>

			{/* Posts Grid */}
			{total > 0 ? (
				<div className="post-grid">
					{loadedPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			) : (
				<div className="blog-empty">
					<p className="font-medium text-foreground mb-1">No articles found</p>
					<p className="text-sm">
						{searchParams.get("search")
							? "Try changing your search terms or clearing the filter."
							: mode === "favorites"
								? "You have not favorited any articles yet."
								: "There are currently no blog articles published."}
					</p>
				</div>
			)}

			{loadedPage < totalPages && (
				<div
					className="mt-8 flex min-h-10 justify-center"
					ref={loadMoreRef}
					aria-live="polite"
				>
					{isLoadingMore && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Spinner className="size-10" />
							<span className="sr-only">Loading more posts</span>
						</div>
					)}
				</div>
			)}
		</>
	);
}
