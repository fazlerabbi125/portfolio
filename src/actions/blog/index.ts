"use server";

import { desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { categories, postCategories, posts } from "@/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import { requireAuth } from "@/lib/session";
import {
	type CategoryInput,
	categorySchema,
	type PostInput,
	postSchema,
} from "@/schemas/blog.schema";

const POSTS_PER_PAGE = 9;

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts({
	page = 1,
	search = "",
}: {
	page?: number;
	search?: string;
}) {
	const offset = (page - 1) * POSTS_PER_PAGE;
	const trimmedSearch = search.trim();
	const searchFilter = trimmedSearch
		? or(
				ilike(posts.title, `%${trimmedSearch}%`),
				ilike(posts.content, `%${trimmedSearch}%`),
			)
		: undefined;

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
		searchFilter ? postsQuery.where(searchFilter) : postsQuery,
		searchFilter ? countQuery.where(searchFilter) : countQuery,
	]);
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

	const total = countRow[0]?.count ?? 0;

	return {
		posts: postRows.map((post) => ({
			...post,
			categoryIds: categoryRows
				.filter((category) => category.postId === post.id)
				.map((category) => category.categoryId),
			category: categoryRows
				.filter((category) => category.postId === post.id)
				.map(({ categoryId, name }) => ({ id: categoryId, name })),
		})),
		total,
		totalPages: Math.ceil(total / POSTS_PER_PAGE),
		currentPage: page,
	};
}

export async function getPostById(id: number) {
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
		categoryIds: categoryRows.map((category) => category.id),
		category: categoryRows,
	};
}

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
