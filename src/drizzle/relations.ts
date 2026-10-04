import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		favorites: r.many.userFavorites(),
	},

	categories: {
		postCategories: r.many.postCategories(),
	},

	posts: {
		postCategories: r.many.postCategories(),

		favorites: r.many.userFavorites(),
	},

	postCategories: {
		post: r.one.posts({
			from: r.postCategories.postId,
			to: r.posts.id,
		}),

		category: r.one.categories({
			from: r.postCategories.categoryId,
			to: r.categories.id,
		}),
	},

	userFavorites: {
		user: r.one.users({
			from: r.userFavorites.userId,
			to: r.users.id,
		}),

		post: r.one.posts({
			from: r.userFavorites.postId,
			to: r.posts.id,
		}),
	},
}));
