"use server";

import { and, desc, eq, exists, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { db } from "@/drizzle/db";
import {
	categories,
	postCategories,
	posts,
	userFavorites,
} from "@/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import { getCurrentUser, requireAuth } from "@/lib/session";
import { attachCategories } from "@/queries/blog.query";
import {
	type CategoryInput,
	categorySchema,
	type PostInput,
	postSchema,
} from "@/schemas/blog.schema";
import type { PaginatedPosts } from "@/types/blog";

const POSTS_PER_PAGE = 15;

/** Returns a filtered page of published posts and categories. */
export async function getPosts({
	categoryId,
	page = 1,
	search = "",
}: {
	categoryId?: number;
	page?: number;
	search?: string;
}): Promise<PaginatedPosts> {
	const requestedCategoryId = categoryId ?? Number.NaN;
	const validCategoryId =
		Number.isSafeInteger(requestedCategoryId) &&
		requestedCategoryId > 0 &&
		requestedCategoryId <= 2_147_483_647
			? requestedCategoryId
			: undefined;
	const trimmedSearch = search.trim();
	const searchFilter = trimmedSearch
		? or(
				ilike(posts.title, `%${trimmedSearch}%`),
				ilike(posts.content, `%${trimmedSearch}%`),
			)
		: undefined;
	const categoryFilter = validCategoryId
		? exists(
				db
					.select({ id: postCategories.postId })
					.from(postCategories)
					.where(
						and(
							eq(postCategories.postId, posts.id),
							eq(postCategories.categoryId, validCategoryId),
						),
					),
			)
		: undefined;
	const filters = and(searchFilter, categoryFilter);

	const offset = (page - 1) * POSTS_PER_PAGE;
	const countQuery = db
		.select({ count: sql<number>`cast(count(*) as int)` })
		.from(posts);

	const postsQuery = db
		.select({
			id: posts.id,
			title: posts.title,
			content: posts.content,
			createdAt: posts.createdAt,
		})
		.from(posts)
		.orderBy(desc(posts.createdAt))
		.limit(POSTS_PER_PAGE)
		.offset(offset);

	const [postRows, countRow] = await Promise.all([
		filters ? postsQuery.where(filters) : postsQuery,
		filters ? countQuery.where(filters) : countQuery,
	]);

	const total = countRow[0]?.count ?? 0;

	return {
		posts: await attachCategories(postRows),
		total,
		totalPages: Math.ceil(total / POSTS_PER_PAGE),
		currentPage: page,
	};
}

/** Returns a filtered page of the signed-in user's favourite posts. */
export async function getFavoritePosts({
	categoryId,
	page = 1,
	search = "",
}: {
	categoryId?: number;
	page?: number;
	search?: string;
}): Promise<PaginatedPosts> {
	const user = await requireAuth();
	const requestedCategoryId = categoryId ?? Number.NaN;
	const validCategoryId =
		Number.isSafeInteger(requestedCategoryId) &&
		requestedCategoryId > 0 &&
		requestedCategoryId <= 2_147_483_647
			? requestedCategoryId
			: undefined;
	const offset = (page - 1) * POSTS_PER_PAGE;
	const trimmedSearch = search.trim();
	const searchFilter = trimmedSearch
		? or(
				ilike(posts.title, `%${trimmedSearch}%`),
				ilike(posts.content, `%${trimmedSearch}%`),
			)
		: undefined;
	const categoryFilter = validCategoryId
		? exists(
				db
					.select({ id: postCategories.postId })
					.from(postCategories)
					.where(
						and(
							eq(postCategories.postId, posts.id),
							eq(postCategories.categoryId, validCategoryId),
						),
					),
			)
		: undefined;
	const favoritesFilter = and(
		eq(userFavorites.userId, user.id),
		searchFilter,
		categoryFilter,
	);

	const countQuery = db
		.select({ count: sql<number>`cast(count(*) as int)` })
		.from(posts)
		.innerJoin(userFavorites, eq(userFavorites.postId, posts.id));

	const postsQuery = db
		.select({
			id: posts.id,
			title: posts.title,
			content: posts.content,
			createdAt: posts.createdAt,
		})
		.from(posts)
		.innerJoin(userFavorites, eq(userFavorites.postId, posts.id))
		.orderBy(desc(posts.createdAt))
		.limit(POSTS_PER_PAGE)
		.offset(offset);

	const [postRows, countRow] = await Promise.all([
		favoritesFilter ? postsQuery.where(favoritesFilter) : postsQuery,
		favoritesFilter ? countQuery.where(favoritesFilter) : countQuery,
	]);

	const total = countRow[0]?.count ?? 0;

	return {
		posts: await attachCategories(postRows),
		total,
		totalPages: Math.ceil(total / POSTS_PER_PAGE),
		currentPage: page,
	};
}

/** Checks whether the signed-in user has favourited a post. */
export async function isPostFavorited(postId: number): Promise<boolean> {
	const user = await getCurrentUser();
	if (user?.role !== USER_ROLES.USER) return false;

	const [favorite] = await db
		.select({ postId: userFavorites.postId })
		.from(userFavorites)
		.where(
			and(eq(userFavorites.userId, user.id), eq(userFavorites.postId, postId)),
		)
		.limit(1);

	return Boolean(favorite);
}

/** Adds or removes a post from the signed-in user's favourites. */
export async function toggleFavorite(
	postId: number,
): Promise<{ ok: boolean; favorited: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.USER) {
		return { ok: false, favorited: false, message: "Forbidden" };
	}

	const [existing] = await db
		.select({ postId: userFavorites.postId })
		.from(userFavorites)
		.where(
			and(eq(userFavorites.userId, user.id), eq(userFavorites.postId, postId)),
		)
		.limit(1);

	if (existing) {
		await db
			.delete(userFavorites)
			.where(
				and(
					eq(userFavorites.userId, user.id),
					eq(userFavorites.postId, postId),
				),
			);
		revalidatePath("/blog");
		revalidatePath(`/blog/${postId}`);
		revalidatePath("/blog/favorites");
		return { ok: true, favorited: false, message: "Removed from favorites" };
	}

	await db.insert(userFavorites).values({ userId: user.id, postId });
	revalidatePath("/blog");
	revalidatePath(`/blog/${postId}`);
	revalidatePath("/blog/favorites");
	return { ok: true, favorited: true, message: "Added to favorites" };
}

/** Retrieves a post and its attached categories by identifier. */
export const getPostById = cache(async (id: number) => {
	const [post] = await db
		.select({
			id: posts.id,
			title: posts.title,
			content: posts.content,
			imageURL: posts.imageURL,
			createdAt: posts.createdAt,
			updatedAt: posts.updatedAt,
		})
		.from(posts)
		.where(eq(posts.id, id))
		.limit(1);

	if (!post) return null;

	const categoryRows = await db
		.select({
			id: categories.id,
			name: categories.name,
		})
		.from(postCategories)
		.innerJoin(categories, eq(postCategories.categoryId, categories.id))
		.where(eq(postCategories.postId, id));

	return {
		...post,
		categoryIds: categoryRows.map(
			(category: (typeof categoryRows)[0]) => category.id,
		),
		category: categoryRows,
	};
});

/** Creates a post and its category links for an administrator. */
export async function createPost(
	input: PostInput,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	const parsed = postSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { title, content, imageURL } = parsed.data;
	const categoryIds = parsed.data.categoryIds ?? [];

	await db.transaction(async (tx) => {
		const [post] = await tx
			.insert(posts)
			.values({
				title,
				content,
				imageURL: imageURL || null,
			})
			.returning({ id: posts.id });

		if (categoryIds.length > 0) {
			await tx.insert(postCategories).values(
				categoryIds.map((categoryId) => ({
					postId: post.id,
					categoryId,
				})),
			);
		}
	});

	revalidatePath("/blog");
	return { ok: true, message: "Post created successfully" };
}

/** Updates a post and replaces its category links for an administrator. */
export async function updatePost(
	id: number,
	input: PostInput,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	const parsed = postSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { title, content, imageURL } = parsed.data;
	const categoryIds = parsed.data.categoryIds ?? [];

	await db.transaction(async (tx) => {
		await tx
			.update(posts)
			.set({
				title,
				content,
				imageURL: imageURL || null,
			})
			.where(eq(posts.id, id));

		await tx.delete(postCategories).where(eq(postCategories.postId, id));

		if (categoryIds.length > 0) {
			await tx.insert(postCategories).values(
				categoryIds.map((categoryId) => ({
					postId: id,
					categoryId,
				})),
			);
		}
	});

	revalidatePath("/blog");
	revalidatePath(`/blog/${id}`);
	return { ok: true, message: "Post updated successfully" };
}

/** Deletes a post for an administrator. */
export async function deletePost(
	id: number,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	await db.delete(posts).where(eq(posts.id, id));
	revalidatePath("/blog");
	return { ok: true, message: "Post deleted successfully" };
}

// ─── Categories ───────────────────────────────────────────────────────────────

/** Returns all categories in alphabetical order. */
export async function getCategories() {
	return db
		.select({
			id: categories.id,
			name: categories.name,
			description: categories.description,
		})
		.from(categories)
		.orderBy(categories.name);
}

/** Creates a category for an administrator. */
export async function createCategory(
	input: CategoryInput,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	const parsed = categorySchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { name, description } = parsed.data;

	const [existing] = await db
		.select({ id: categories.id })
		.from(categories)
		.where(eq(categories.name, name))
		.limit(1);

	if (existing) {
		return { ok: false, message: "A category with this name already exists" };
	}

	await db
		.insert(categories)
		.values({ name, description: description || null });
	revalidatePath("/blog");
	return { ok: true, message: "Category created successfully" };
}

/** Updates a category for an administrator. */
export async function updateCategory(
	id: number,
	input: CategoryInput,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	const parsed = categorySchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { name, description } = parsed.data;
	await db
		.update(categories)
		.set({ name, description: description || null })
		.where(eq(categories.id, id));

	revalidatePath("/blog");
	return { ok: true, message: "Category updated successfully" };
}

/** Deletes a category for an administrator. */
export async function deleteCategory(
	id: number,
): Promise<{ ok: boolean; message: string }> {
	const user = await requireAuth();
	if (user.role !== USER_ROLES.ADMIN) {
		return { ok: false, message: "Forbidden" };
	}

	await db.delete(categories).where(eq(categories.id, id));
	revalidatePath("/blog");
	return { ok: true, message: "Category deleted successfully" };
}
