CREATE TABLE "post_categories" (
	"post_id" integer,
	"category_id" integer,
	CONSTRAINT "post_categories_pkey" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_category_id_categories_id_fkey";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "category_id";--> statement-breakpoint
CREATE INDEX "post_categories_category_id_idx" ON "post_categories" ("category_id");--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_post_id_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE;