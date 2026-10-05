import { redirect } from "next/navigation";
import { getCategories, getFavoritePosts } from "@/actions/blog";
import PostList from "@/components/blog/PostList";
import { USER_ROLES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

interface FavoritesPageProps {
	searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function FavoritesPage({
	searchParams,
}: Readonly<FavoritesPageProps>) {
	const user = await getCurrentUser();
	if (!user || user.role !== USER_ROLES.USER) {
		redirect("/blog");
	}

	const resolvedSearchParams = await searchParams;
	const page = Math.max(1, Number(resolvedSearchParams.page) || 1);
	const search = resolvedSearchParams.search || "";

	const [{ posts, total, totalPages, currentPage }, categories] =
		await Promise.all([
			getFavoritePosts({ page, search }),
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
				currentUser={user}
				mode="favorites"
			/>
		</section>
	);
}
