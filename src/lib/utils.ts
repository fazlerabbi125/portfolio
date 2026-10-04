import argon2 from "argon2";

export interface ApiCallConfig extends Omit<RequestInit, "headers"> {
	url: Parameters<typeof fetch>[0];
	params?: Record<string, string | number | boolean | null | undefined>;
	headers?: Record<string, string>;
}

export class API {
	private readonly _baseUrl: string;
	private readonly _timeout: number | undefined;

	constructor({ baseUrl, timeout }: { baseUrl?: string; timeout?: number }) {
		this._baseUrl = baseUrl || "";
		this._timeout = timeout;
	}

	makeRequest = async <T = any>(config: ApiCallConfig) => {
		let {
			url,
			params,
			method = "GET",
			headers,
			body,
			...fetchOptions
		} = config;
		const jsonContentTypeHeader = "application/json";
		url = this._baseUrl + String(url);

		if (
			body != null &&
			!Object.keys(headers ?? {}).some(
				(key) => key.toLowerCase() === "content-type",
			)
		) {
			headers = {
				...headers,
				"Content-Type": jsonContentTypeHeader,
			};
		}

		if (
			params &&
			Object.keys(params).length &&
			["GET", "DELETE"].includes(method.toUpperCase())
		) {
			const searchParams = new URLSearchParams();

			for (const [key, value] of Object.entries(params)) {
				if (value != null) {
					searchParams.append(key, String(value));
				}
			}

			const queryString = searchParams.toString();

			if (queryString) {
				url += url.includes("?") ? queryString : `?${queryString}`;
			}
		}

		const res = await fetch(url, {
			...fetchOptions,
			method,
			body:
				body && headers?.["Content-Type"] === jsonContentTypeHeader
					? JSON.stringify(body)
					: body,
			headers,
			...(this._timeout ? { signal: AbortSignal.timeout(this._timeout) } : {}),
		});

		let data: unknown = null;

		if (res.status !== 204) {
			const contentType = res.headers.get("Content-Type");

			if (contentType?.includes(jsonContentTypeHeader)) {
				data = await res.json();
			} else {
				data = await res.text();
			}
		}

		if (!res.ok) {
			return Promise.reject({
				data,
				status: res.status,
				statusText: res.statusText,
			});
		}

		return {
			data: data as T,
			status: res.status,
			statusText: res.statusText,
		};
	};
}

export function getRequiredEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password);
}

export async function verifyPassword(
	hashedPassword: string,
	plainPassword: string,
): Promise<boolean> {
	return argon2.verify(hashedPassword, plainPassword);
}
