"use client";

import {
	ArrowLeft,
	Calendar,
	Edit3,
	Heart,
	Share2,
	Tag,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { deletePost, toggleFavorite } from "@/actions/blog";
import DeleteConfirmDialog from "@/components/blog/DeleteConfirmDialog";
import PostModal from "@/components/blog/PostModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { USER_ROLES } from "@/lib/constants";
import type { SessionData } from "@/lib/session";
import "./PostList.css";

interface Category {
	id: number;
	name: string;
}

interface PostDetail {
	id: number;
	title: string;
	content: string;
	imageURL?: string | null;
	createdAt: Date | string;
	categoryIds?: number[];
	category?: {
		id: number;
		name: string;
	}[];
}

interface PostDetailViewProps {
	post: PostDetail;
	categories: Category[];
	currentUser: SessionData | null;
	shareUrl: string;
	isFavorited?: boolean;
}

export default function PostDetailView({
	post,
	categories,
	currentUser,
	shareUrl,
	isFavorited = false,
}: Readonly<PostDetailViewProps>) {
	const router = useRouter();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [favorited, setFavorited] = useState(isFavorited);
	const [resolvedShareUrl, setResolvedShareUrl] = useState(shareUrl);

	useEffect(() => {
		if (shareUrl.startsWith("http")) {
			setResolvedShareUrl(shareUrl);
			return;
		}
		setResolvedShareUrl(new URL(shareUrl, window.location.origin).toString());
	}, [shareUrl]);

	const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
	const canFavorite = currentUser?.role === USER_ROLES.USER;

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(post.createdAt));

	const handleDelete = async () => {
		setIsDeleting(true);
		const result = await deletePost(post.id);
		setIsDeleting(false);

		if (result.ok) {
			router.push("/blog");
			router.refresh();
		} else {
			alert(result.message);
		}
	};

	const handleFavorite = async () => {
		const result = await toggleFavorite(post.id);
		if (result.ok) {
			setFavorited(result.favorited);
		}
	};

	return (
		<article className="blog-detail">
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<Button
					variant="ghost"
					size="sm"
					className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
					render={<Link href="/blog" />}
				>
					<ArrowLeft size={16} />
					Back to Articles
				</Button>

				<div className="flex items-center gap-2">
					{canFavorite && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleFavorite}
							className="bg-surface gap-1.5"
							aria-pressed={favorited}
							aria-label={
								favorited ? "Remove from favorites" : "Add to favorites"
							}
						>
							<Heart
								size={15}
								className={favorited ? "fill-current text-red-500" : undefined}
							/>
							{favorited ? "Unfavorite" : "Favorite"}
						</Button>
					)}
					<Dialog>
						<DialogTrigger
							render={
								<Button
									variant="outline"
									size="sm"
									className="bg-surface gap-1.5"
									aria-label="Share this post"
								/>
							}
						>
							<Share2 size={15} />
							Share
						</DialogTrigger>
						<DialogContent showCloseButton>
							<DialogHeader>
								<DialogTitle>Share this post</DialogTitle>
								<DialogDescription>
									Choose where you would like to share it.
								</DialogDescription>
							</DialogHeader>
							<div className="flex justify-center gap-4 mt-4">
								<WhatsappShareButton
									url={resolvedShareUrl}
									title={post.title}
									aria-label="Share on WhatsApp"
								>
									<WhatsappIcon size={48} round />
								</WhatsappShareButton>
								<LinkedinShareButton
									url={resolvedShareUrl}
									title={post.title}
									aria-label="Share on LinkedIn"
								>
									<LinkedinIcon size={48} round />
								</LinkedinShareButton>
								<FacebookShareButton
									url={resolvedShareUrl}
									aria-label="Share on Facebook"
								>
									<FacebookIcon size={48} round />
								</FacebookShareButton>
							</div>
							<DialogFooter>
								<DialogClose
									render={
										<Button className="bg-foreground text-surface">
											Close
										</Button>
									}
								>
									Close
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					{isAdmin && (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditModalOpen(true)}
								className="bg-surface gap-1.5"
							>
								<Edit3 size={15} />
								Edit Post
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsDeleteDialogOpen(true)}
								className="gap-1.5 bg-red-500 text-white hover:bg-red-600"
							>
								<Trash2 size={15} />
								Delete Post
							</Button>
						</>
					)}
				</div>
			</div>

			<header className="blog-detail__header">
				{post.category?.length ? (
					<div className="mb-3">
						<div className="flex flex-wrap gap-2">
							{post.category.map((category) => (
								<Badge
									key={category.id}
									variant="secondary"
									className="text-sm font-normal py-1 px-3"
								>
									<Tag size={13} className="mr-1.5 inline opacity-70" />
									{category.name}
								</Badge>
							))}
						</div>
					</div>
				) : null}
				<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
					{post.title}
				</h1>
				<div className="blog-detail__meta">
					<div className="flex items-center gap-2">
						<Calendar size={15} />
						<time dateTime={new Date(post.createdAt).toISOString()}>
							{formattedDate}
						</time>
					</div>
				</div>
			</header>

			{post.imageURL && (
				<div className="relative w-full aspect-video max-h-96 rounded-xl overflow-hidden border border-border mb-8 bg-muted">
					<Image
						src={post.imageURL}
						alt={post.title}
						fill
						sizes="(max-width: 800px) 100vw, 800px"
						className="object-cover"
						unoptimized
					/>
				</div>
			)}

			<section className="blog-detail__content">{post.content}</section>

			{isAdmin && (
				<>
					<PostModal
						open={isEditModalOpen}
						onOpenChange={setIsEditModalOpen}
						categories={categories}
						initialPost={post}
					/>
					<DeleteConfirmDialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
						title={`Delete "${post.title}"?`}
						description="This article will be permanently removed. This action cannot be undone."
						onConfirm={handleDelete}
						isDeleting={isDeleting}
					/>
				</>
			)}
		</article>
	);
}
