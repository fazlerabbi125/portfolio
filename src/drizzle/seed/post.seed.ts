import { inArray } from "drizzle-orm";
import { z } from "zod";
import { API } from "@/lib/utils";
import { db, pool } from "../db";
import { posts } from "../schema";

const COUNT = 30;
const SOURCE_URL = `https://dummyjson.com/posts?limit=${COUNT}`;

const responseSchema = z.object({
	posts: z.array(
		z.object({
			id: z.number(),
			title: z.string().min(1).max(200), // posts.title is varchar(200)
			body: z.string().min(1),
		}),
	),
});

async function main() {
	const res = await new API({}).makeRequest({
		url: SOURCE_URL,
	});
	if (!res.ok) {
		throw new Error(`dummyjson responded with ${res.status}`);
	}

	const { posts: source } = responseSchema.parse(res.data);

	const candidates = source.map((p, i) => {
		return {
			title: p.title,
			content: p.body,
			imageURL: `https://picsum.photos/seed/dummyjson-${p.id}/1200/630`,
		};
	});

	// title isn't unique in the schema, so guard against duplicates on re-run
	const existing = await db
		.select({ title: posts.title })
		.from(posts)
		.where(
			inArray(
				posts.title,
				candidates.map((c) => c.title),
			),
		);
	const existingTitles = new Set(existing.map((r) => r.title));
	const rows = candidates.filter((c) => !existingTitles.has(c.title));

	if (rows.length === 0) {
		console.log("All posts already exist. Nothing to insert.");
		return;
	}

	await db.insert(posts).values(rows);
	console.log(
		`Inserted ${rows.length} posts (${candidates.length - rows.length} skipped as duplicates).`,
	);
}

try {
	await main();
} catch (error) {
	console.error("Failed to seed posts:", error);
	process.exitCode = 1;
} finally {
	await pool.end();
}
