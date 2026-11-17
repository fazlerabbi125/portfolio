import { getCategories, getPosts } from "@/actions/blog.action";
import BlogManagementBar from "@/components/blog/BlogManagementBar";
import PostList from "@/components/blog/PostList";
import { getCurrentUser } from "@/lib/session";

interface BlogPageProps {
	searchParams: Promise<{ category?: string; search?: string }>;
}

/** Renders the searchable public blog listing. */
export default async function BlogPage({
	searchParams,
}: Readonly<BlogPageProps>) {
	const user = await getCurrentUser();
	const resolvedSearchParams = await searchParams;

	const search = resolvedSearchParams.search || "";
	const category = resolvedSearchParams.category;
	const categoryId =
		category && /^[1-9]\d*$/.test(category) ? Number(category) : undefined;

	const [{ posts, total, totalPages, currentPage }, categories] =
		await Promise.all([getPosts({ categoryId, search }), getCategories()]);

	return (
		<section className="container mx-auto px-4 py-8">
			<BlogManagementBar categories={categories} currentUser={user} />
			<PostList
				posts={posts}
				total={total}
				totalPages={totalPages}
				currentPage={currentPage}
				categories={categories}
			/>
		</section>
	);
}
