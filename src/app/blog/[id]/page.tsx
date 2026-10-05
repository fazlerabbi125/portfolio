import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getPostById, isPostFavorited } from "@/actions/blog";
import PostDetailView from "@/components/blog/PostDetailView";
import { getCurrentUser } from "@/lib/session";

interface BlogPostPageProps {
	params: Promise<{ id: string }>;
}

const commonSEOconfig = {
	siteName: "Fazle Rabbi Faiyaz Portfolio",
	image: "/ogp-photo.jpg",
};

const appURL = process.env.NEXT_PUBLIC_APP_URL
	? new URL(process.env.NEXT_PUBLIC_APP_URL)
	: undefined;

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { id } = await params;
	const postId = Number(id);
	if (Number.isNaN(postId)) return { title: "Post Not Found" };

	const post = await getPostById(postId);
	if (!post) return { title: "Post Not Found" };

	const description = post.content.slice(0, 160);
	const pageUrl = appURL
		? new URL(`/blog/${post.id}`, appURL).toString()
		: undefined;
	const image = post.imageURL || commonSEOconfig.image;

	return {
		title: post.title,
		description,
		openGraph: {
			type: "article",
			siteName: commonSEOconfig.siteName,
			title: post.title,
			description,
			url: pageUrl,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description,
			images: [image],
		},
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

	const [post, categories, favorited] = await Promise.all([
		getPostById(postId),
		getCategories(),
		isPostFavorited(postId),
	]);

	if (!post) {
		notFound();
	}

	const shareUrl = appURL
		? new URL(`/blog/${post.id}`, appURL).toString()
		: `/blog/${post.id}`;

	return (
		<main className="container mx-auto px-4 py-8">
			<PostDetailView
				post={post}
				categories={categories}
				currentUser={user}
				shareUrl={shareUrl}
				isFavorited={favorited}
			/>
		</main>
	);
}
