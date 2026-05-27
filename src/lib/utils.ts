import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const headerSchema = z.object({
	key: z.string(),
	value: z.string(),
});

export function getHeaders() {
	const headerVal = localStorage.getItem("header");
	if (!headerVal) {
		throw new Error("header is invalid");
	}
	const header = headerSchema.safeParse(JSON.parse(headerVal));
	if (!header.success) {
		throw new Error("header is invalid");
	}
	return {
		[header.data.key]: header.data.value,
	};
}
