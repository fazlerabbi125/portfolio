"use server";

import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import {
	getSession,
	requireAuth,
	type SessionData,
	setSessionInfo,
} from "@/lib/session";
import {
	type ChangePasswordInput,
	changePasswordSchema,
	type LoginInput,
	loginSchema,
	type RegisterInput,
	registerSchema,
	type UpdateProfileInput,
	updateProfileSchema,
} from "@/schemas/auth.schema";

/** Authenticates a user and starts their session. */
export async function login(
	input: LoginInput,
): Promise<{ ok: boolean; message: string }> {
	const parsed = loginSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { email, password } = parsed.data;

	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!user) {
		return { ok: false, message: "Invalid email or password" };
	}

	const isValid = await argon2.verify(user.hashedPassword, password);
	if (!isValid) {
		return { ok: false, message: "Invalid email or password" };
	}

	const session = await getSession();
	setSessionInfo(session, {
		id: user.id,
		name: user.name,
		role: user.role,
	});
	await session.save();

	return { ok: true, message: `Welcome back, ${user.name}!` };
}

/** Registers a new user and starts their session. */
export async function register(
	input: RegisterInput,
): Promise<{ ok: boolean; message: string }> {
	const parsed = registerSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	const { name, email, password } = parsed.data;

	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existing) {
		return { ok: false, message: "An account with this email already exists" };
	}

	const hashedPassword = await argon2.hash(password);

	let newUser: SessionData | undefined;
	try {
		[newUser] = await db
			.insert(users)
			.values({ name, email, hashedPassword, role: USER_ROLES.USER })
			.returning({ id: users.id, name: users.name, role: users.role });
	} catch {
		return { ok: false, message: "Registration failed. Please try again." };
	}

	if (!newUser) {
		return { ok: false, message: "Registration failed. Please try again." };
	}

	const session = await getSession();
	setSessionInfo(session, {
		id: newUser.id,
		name: newUser.name,
		role: newUser.role,
	});
	await session.save();

	return {
		ok: true,
		message: `Welcome, ${newUser.name}! Your account has been created.`,
	};
}

/** Ends the active user session. */
export async function logout(): Promise<void> {
	const session = await getSession();
	session.destroy();
	refresh();
}

/** Updates the authenticated user's name, email, and session display name. */
export async function updateProfile(
	input: UpdateProfileInput,
): Promise<{ ok: boolean; message: string }> {
	const parsed = updateProfileSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	let user: SessionData;
	try {
		user = await requireAuth();
	} catch {
		return { ok: false, message: "Please log in to update your profile." };
	}

	let existingUser: { id: string } | undefined;
	let updatedUser: { name: string; email: string } | undefined;
	try {
		[existingUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, parsed.data.email))
			.limit(1);

		if (existingUser && existingUser.id !== user.id) {
			return {
				ok: false,
				message: "An account with this email already exists.",
			};
		}

		[updatedUser] = await db
			.update(users)
			.set({ name: parsed.data.name, email: parsed.data.email })
			.where(eq(users.id, user.id))
			.returning({ name: users.name, email: users.email });
	} catch {
		return { ok: false, message: "Profile update failed. Please try again." };
	}

	if (!updatedUser) {
		return { ok: false, message: "Profile update failed. Please try again." };
	}

	const session = await getSession();
	if (!session) {
		return {
			ok: false,
			message: "Session not found. Please log in again.",
		};
	}
	setSessionInfo(session, { ...user, name: updatedUser.name });
	await session.save();
	return { ok: true, message: "Your profile has been updated." };
}

/** Changes a password after verifying the current password. */
export async function changePassword(
	input: ChangePasswordInput,
): Promise<{ ok: boolean; message: string }> {
	const parsed = changePasswordSchema.safeParse(input);
	if (!parsed.success) {
		return {
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Invalid input",
		};
	}

	let user: SessionData;
	try {
		user = await requireAuth();
	} catch {
		return { ok: false, message: "Please log in to change your password." };
	}

	let currentUser: { hashedPassword: string } | undefined;
	try {
		[currentUser] = await db
			.select({ hashedPassword: users.hashedPassword })
			.from(users)
			.where(eq(users.id, user.id))
			.limit(1);
	} catch {
		return { ok: false, message: "Password change failed. Please try again." };
	}

	if (
		!currentUser ||
		!(await argon2.verify(
			currentUser.hashedPassword,
			parsed.data.currentPassword,
		))
	) {
		return { ok: false, message: "Current password is incorrect." };
	}

	try {
		const [updatedUser] = await db
			.update(users)
			.set({ hashedPassword: await argon2.hash(parsed.data.password) })
			.where(
				and(
					eq(users.id, user.id),
					eq(users.hashedPassword, currentUser.hashedPassword),
				),
			)
			.returning({ id: users.id });

		if (!updatedUser) {
			return {
				ok: false,
				message: "Your password changed in another session. Please try again.",
			};
		}
	} catch {
		return { ok: false, message: "Password change failed. Please try again." };
	}

	return { ok: true, message: "Your password has been changed." };
}
