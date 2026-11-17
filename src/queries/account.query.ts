import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/session";

export type CurrentAccount = {
	id: string;
	name: string;
	email: string;
	role: typeof users.$inferSelect.role;
};

/** Gets the signed-in account fields required by the header. */
export async function getCurrentAccount(): Promise<CurrentAccount | null> {
	const sessionUser = await getCurrentUser();
	if (!sessionUser) return null;

	const [account] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
		})
		.from(users)
		.where(eq(users.id, sessionUser.id))
		.limit(1);

	return account ?? null;
}
