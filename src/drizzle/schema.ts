import {
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { USER_ROLES } from "@/lib/constants";

const timestamps = {
	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
};

export const userRoleEnum = pgEnum("role", [USER_ROLES.ADMIN, USER_ROLES.USER]);

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().defaultRandom(),
		email: varchar({ length: 255 }).notNull().unique(),
		hashedPassword: text("hashed_password").notNull(),
		name: varchar({ length: 255 }).notNull(),
		role: userRoleEnum().notNull().default(USER_ROLES.USER),
		...timestamps,
	},
	(table) => [
		index("name_idx").on(table.name),
		index("role_idx").on(table.role),
	],
);

export const categories = pgTable("categories", {
	id: serial().primaryKey(),
	name: varchar({ length: 150 }).notNull().unique(),
	description: text(),
	...timestamps,
});

export const posts = pgTable(
	"posts",
	{
		id: serial().primaryKey(),
		title: varchar({ length: 200 }).notNull(),
		content: text().notNull(),
		imageURL: text("image_url"),
		...timestamps,
	},
	(table) => [index("title_idx").on(table.title)],
);

export const postCategories = pgTable(
	"post_categories",
	{
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, {
				onDelete: "cascade",
			}),
		categoryId: integer("category_id")
			.notNull()
			.references(() => categories.id, {
				onDelete: "cascade",
			}),
	},
	(table) => [
		primaryKey({
			columns: [table.postId, table.categoryId],
		}),
		index("post_categories_category_id_idx").on(table.categoryId),
	],
);

export const userFavorites = pgTable(
	"favorites",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),

		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, {
				onDelete: "cascade",
			}),

		...timestamps,
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.postId],
		}),
		index("favorites_post_id_idx").on(table.postId),
	],
);
