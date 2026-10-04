import "dotenv/config";
import { eq } from "drizzle-orm";
import { getRequiredEnv, hashPassword } from "@/lib/utils";
import { USER_ROLES } from "../../lib/constants";
import { db, pool } from "../db";
import { users } from "../schema";

async function main() {
	const email = getRequiredEnv("ADMIN_EMAIL");
	const password = getRequiredEnv("ADMIN_PASSWORD");
	const name = process.env.ADMIN_NAME || "Administrator";
	const hashedPassword = await hashPassword(password);

	const [existingUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existingUser) {
		console.log(
			`User with email ${email} already exists; no user was created.`,
		);
		return;
	}

	await db.insert(users).values({
		email,
		hashedPassword,
		name,
		role: USER_ROLES.ADMIN,
	});

	console.log(`Created admin user ${email}.`);
}

try {
	await main();
} catch (error) {
	console.error("Failed to seed admin user:", error);
	process.exitCode = 1;
} finally {
	await pool.end();
}
