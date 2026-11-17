"use client";

import { LogIn, Plus, Tags } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/blog/AuthModal";
import CategoryModal from "@/components/blog/CategoryModal";
import PostModal from "@/components/blog/PostModal";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/lib/constants";
import type { SessionData } from "@/lib/session";

interface Category {
	id: number;
	name: string;
	description?: string | null;
}

interface BlogManagementBarProps {
	categories: Category[];
	currentUser: SessionData | null;
}

/** Renders blog authentication and administrator content controls. */
export default function BlogManagementBar({
	categories,
	currentUser,
}: Readonly<BlogManagementBarProps>) {
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const isAdmin = currentUser?.role === USER_ROLES.ADMIN;

	if (currentUser && !isAdmin) {
		return null;
	}

	return (
		<>
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

			<AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
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
