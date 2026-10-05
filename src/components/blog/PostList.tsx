"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	LogIn,
	Plus,
	Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/blog/AuthModal";
import CategoryModal from "@/components/blog/CategoryModal";
import PostCard, { type PostCardData } from "@/components/blog/PostCard";
import PostModal from "@/components/blog/PostModal";
import SearchBar from "@/components/blog/SearchBar";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/lib/constants";
import type { SessionData } from "@/lib/session";
import "./PostList.css";

interface Category {
	id: number;
	name: string;
	description?: string | null;
}

interface PostListProps {
	posts: PostCardData[];
	total: number;
	totalPages: number;
	currentPage: number;
	categories: Category[];
	currentUser: SessionData | null;
	mode?: "blog" | "favorites";
}

type PageToken = number | "start-ellipsis" | "end-ellipsis";

function getPageTokens(currentPage: number, totalPages: number): PageToken[] {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	if (currentPage <= 3) {
		return [1, 2, 3, "end-ellipsis", totalPages];
	}
	if (currentPage >= totalPages - 2) {
		return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages];
	}
	return [
		1,
		"start-ellipsis",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"end-ellipsis",
		totalPages,
	];
}

export default function PostList({
	posts,
	total,
	totalPages,
	currentPage,
	categories,
	currentUser,
	mode = "blog",
}: Readonly<PostListProps>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
	const showManagementBar = mode === "blog" && (isAdmin || !currentUser);

	const createPageUrl = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

	return (
		<>
			{showManagementBar && (
				<div className="blog-header-bar">
					{isAdmin ? (
						<div className="blog-header-bar__actions ml-auto">
							<Button
								size="sm"
								onClick={() => setIsPostModalOpen(true)}
								className="gap-1.5"
							>
								<Plus size={15} />
								New Post
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsCategoryModalOpen(true)}
								className="bg-surface gap-1.5"
							>
								<Tags size={15} />
								Categories
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsAuthModalOpen(true)}
							className="blog-header-bar__user gap-1.5"
						>
							<LogIn size={15} />
							Log in / Register for additional features.
						</Button>
					)}
				</div>
			)}

			<div className="mb-[4rem] px-4 flex justify-center">
				<SearchBar />
			</div>

			{/* Posts Grid */}
			{total > 0 ? (
				<div className="post-grid">
					{posts.map((post) => (
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

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<nav className="blog-pagination" aria-label="Blog pagination">
					<Button
						variant="outline"
						size="icon-sm"
						disabled={currentPage <= 1}
						aria-label="First page"
						render={
							currentPage > 1 ? <Link href={createPageUrl(1)} /> : undefined
						}
					>
						<ChevronsLeft size={16} />
					</Button>

					<Button
						variant="outline"
						size="icon-sm"
						disabled={currentPage <= 1}
						aria-label="Previous page"
						render={
							currentPage > 1 ? (
								<Link href={createPageUrl(currentPage - 1)} />
							) : undefined
						}
					>
						<ChevronLeft size={16} />
					</Button>

					{getPageTokens(currentPage, totalPages).map((token) =>
						typeof token === "number" ? (
							<Button
								key={token}
								variant={token === currentPage ? "default" : "outline"}
								size="sm"
								className="min-w-8 h-8 px-2"
								aria-current={token === currentPage ? "page" : undefined}
								aria-label={`Page ${token}`}
								render={
									token !== currentPage ? (
										<Link href={createPageUrl(token)} />
									) : undefined
								}
							>
								{token}
							</Button>
						) : (
							<span
								className="blog-pagination__ellipsis"
								key={token}
								aria-hidden="true"
							>
								…
							</span>
						),
					)}

					<Button
						variant="outline"
						size="icon-sm"
						disabled={currentPage >= totalPages}
						aria-label="Next page"
						render={
							currentPage < totalPages ? (
								<Link href={createPageUrl(currentPage + 1)} />
							) : undefined
						}
					>
						<ChevronRight size={16} />
					</Button>

					<Button
						variant="outline"
						size="icon-sm"
						disabled={currentPage >= totalPages}
						aria-label="Last page"
						render={
							currentPage < totalPages ? (
								<Link href={createPageUrl(totalPages)} />
							) : undefined
						}
					>
						<ChevronsRight size={16} />
					</Button>
				</nav>
			)}

			{/* Login / Register Dialog */}
			<AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

			{/* Admin Post & Category Dialogs */}
			{isAdmin && (
				<>
					<PostModal
						open={isPostModalOpen}
						onOpenChange={setIsPostModalOpen}
						categories={categories}
					/>
					<CategoryModal
						open={isCategoryModalOpen}
						onOpenChange={setIsCategoryModalOpen}
						categories={categories}
					/>
				</>
			)}
		</>
	);
}
