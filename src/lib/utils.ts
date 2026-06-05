import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// const headerSchema = z.object({
// 	key: z.string(),
// 	value: z.string(),
// });

export function getHeaders() {
	// const headerVal = localStorage.getItem("header");
	// if (!headerVal) {
	// 	return {};
	// }
	// const header = headerSchema.safeParse(JSON.parse(headerVal));
	// if (!header.success) {
	// 	return {};
	// }
	// return {
	// 	[header.data.key]: header.data.value,
	// };
	return {};
}

export function getApiv1() {
	return import.meta.env.DEV ? "/api" : import.meta.env.VITE_API;
}

export function getClerkPushableKey() {
	const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
	if (!key) {
		throw new Error("clerk pushable key undefined");
	}
	return key;
}
