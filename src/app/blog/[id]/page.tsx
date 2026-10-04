import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getPostById } from "@/actions/blog";
import PostDetailView from "@/components/blog/PostDetailView";
import { getCurrentUser } from "@/lib/session";

interface BlogPostPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { id } = await params;
	const postId = Number(id);
	if (Number.isNaN(postId)) return { title: "Post Not Found" };

	const post = await getPostById(postId);
	if (!post) return { title: "Post Not Found" };

	return {
		title: `${post.title} — Fazle Rabbi Faiyaz`,
		description: post.content.slice(0, 160),
	};
}

export default async function BlogPostPage({
	params,
}: Readonly<BlogPostPageProps>) {
	const user = await getCurrentUser();

	const { id } = await params;
	const postId = Number(id);
	if (Number.isNaN(postId)) {
		notFound();
	}

	const [post, categories] = await Promise.all([
		getPostById(postId),
		getCategories(),
	]);

	if (!post) {
		notFound();
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<PostDetailView post={post} categories={categories} currentUser={user} />
		</main>
	);
}
