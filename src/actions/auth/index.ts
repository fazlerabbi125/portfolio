"use server";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import { getSession } from "@/lib/session";
import {
	type LoginInput,
	loginSchema,
	type RegisterInput,
	registerSchema,
} from "@/schemas/auth.schema";

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
	session.id = user.id;
	session.name = user.name;
	session.role = user.role;
	await session.save();

	return { ok: true, message: `Welcome back, ${user.name}!` };
}

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

	const [newUser] = await db
		.insert(users)
		.values({ name, email, hashedPassword, role: USER_ROLES.USER })
		.returning({ id: users.id, name: users.name, role: users.role });

	if (!newUser) {
		return { ok: false, message: "Registration failed. Please try again." };
	}

	const session = await getSession();
	session.id = newUser.id;
	session.name = newUser.name;
	session.role = newUser.role;
	await session.save();

	return {
		ok: true,
		message: `Welcome, ${newUser.name}! Your account has been created.`,
	};
}

export async function logout(): Promise<void> {
	const session = await getSession();
	session.destroy();
	redirect("/blog");
}
