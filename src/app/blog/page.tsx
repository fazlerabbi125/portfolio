import { getCategories, getPosts } from "@/actions/blog";
import PostList from "@/components/blog/PostList";
import { getCurrentUser } from "@/lib/session";

interface BlogPageProps {
	searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BlogPage({
	searchParams,
}: Readonly<BlogPageProps>) {
	const user = await getCurrentUser();
	const resolvedSearchParams = await searchParams;

	const page = Math.max(1, Number(resolvedSearchParams.page) || 1);
	const search = resolvedSearchParams.search || "";

	const [{ posts, total, totalPages, currentPage }, categories] =
		await Promise.all([getPosts({ page, search }), getCategories()]);

	return (
		<section className="container mx-auto px-4 py-8">
			<PostList
				posts={posts}
				total={total}
				totalPages={totalPages}
				currentPage={currentPage}
				categories={categories}
				currentUser={user}
			/>
		</section>
	);
}
