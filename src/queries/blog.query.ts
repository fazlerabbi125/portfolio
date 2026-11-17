import "server-only";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { categories, postCategories } from "@/drizzle/schema";

/** Attaches category data in one batched query to avoid per-post queries. */
export async function attachCategories<T extends { id: number }>(
	postRows: T[],
) {
	const categoryRows = postRows.length
		? await db
				.select({
					postId: postCategories.postId,
					categoryId: categories.id,
					name: categories.name,
				})
				.from(postCategories)
				.innerJoin(categories, eq(postCategories.categoryId, categories.id))
				.where(
					inArray(
						postCategories.postId,
						postRows.map((post) => post.id),
					),
				)
		: [];

	return postRows.map((post) => ({
		...post,
		categoryIds: categoryRows
			.filter((category) => category.postId === post.id)
			.map((category) => category.categoryId),
		category: categoryRows
			.filter((category) => category.postId === post.id)
			.map(({ categoryId, name }) => ({ id: categoryId, name })),
	}));
}
