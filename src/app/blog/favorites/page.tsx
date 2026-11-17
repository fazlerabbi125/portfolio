import { redirect } from "next/navigation";
import { getCategories, getFavoritePosts } from "@/actions/blog.action";
import PostList from "@/components/blog/PostList";
import { USER_ROLES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

interface FavoritesPageProps {
	searchParams: Promise<{ category?: string; search?: string }>;
}

/** Renders the signed-in user's favourite posts. */
export default async function FavoritesPage({
	searchParams,
}: Readonly<FavoritesPageProps>) {
	const user = await getCurrentUser();
	if (user?.role !== USER_ROLES.USER) {
		redirect("/blog");
	}

	const resolvedSearchParams = await searchParams;
	const search = resolvedSearchParams.search || "";
	const categoryId = Number(resolvedSearchParams.category) || undefined;

	const [{ posts, total, totalPages, currentPage }, categories] =
		await Promise.all([
			getFavoritePosts({ categoryId, search }),
			getCategories(),
		]);

	return (
		<section className="container mx-auto px-4 py-8">
			<h1 className="page-title text-center !mb-[2.5rem]">Favorites</h1>
			<PostList
				posts={posts}
				total={total}
				totalPages={totalPages}
				currentPage={currentPage}
				categories={categories}
				mode="favorites"
			/>
		</section>
	);
}
