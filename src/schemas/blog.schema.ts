import * as z from "zod";

export const postSchema = z.object({
	title: z
		.string("Invalid data type")
		.min(3, "Title must be at least 3 characters")
		.max(200, "Title must be at most 200 characters"),
	content: z
		.string("Invalid data type")
		.min(10, "Content must be at least 10 characters"),
	imageURL: z.url("Must be a valid URL").or(z.literal("")).optional(),
	categoryIds: z.array(z.number().int().positive()).optional(),
});

export const categorySchema = z.object({
	name: z
		.string("Invalid data type")
		.trim()
		.min(2, "Category name must be at least 2 characters")
		.max(150, "Category name must be at most 150 characters"),
	description: z
		.string("Invalid data type")
		.trim()
		.max(500, "Description must be at most 500 characters")
		.or(z.literal(""))
		.optional(),
});

export type PostInput = z.infer<typeof postSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
