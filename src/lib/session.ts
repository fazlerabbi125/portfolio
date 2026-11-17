import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { USER_ROLES } from "@/lib/constants";

export interface SessionData {
	id: string;
	name: string;
	role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
}

const SESSION_OPTIONS = {
	password: process.env.SESSION_SECRET as string,
	cookieName: "portfolio_session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		httpOnly: true,
		sameSite: "lax" as const,
	},
};

/** Returns the encrypted session associated with the current request. */
export async function getSession() {
	const cookieStore = await cookies();
	return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

/** Copies the supplied identity fields into an active session. */
export function setSessionInfo(
	session: Awaited<ReturnType<typeof getSession>>,
	user: SessionData,
) {
	// Iron Session serialises enumerable properties, so remove stale data first.
	for (const key of Object.keys(session)) {
		delete (session as Record<string, unknown>)[key];
	}
	session.id = user.id;
	session.name = user.name;
	session.role = user.role;
}

/** Returns the signed-in session identity, when one is available. */
export async function getCurrentUser(): Promise<SessionData | null> {
	const session = await getSession();
	if (!session.id || !session.name || !session.role) return null;
	return { id: session.id, name: session.name, role: session.role };
}

/** Returns the current identity or rejects unauthenticated requests. */
export async function requireAuth(): Promise<SessionData> {
	const user = await getCurrentUser();
	if (!user) throw new Error("Unauthorized");
	return user;
}
