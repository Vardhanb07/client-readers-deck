import * as z from "zod";
import { getApiv1 } from "@/lib/utils";

// send Bearer [token] in header
class Apiv1 {
	private readonly apiv1: string;

	constructor(apiv1: string) {
		this.apiv1 = apiv1;
	}

	async getCategories({
		getToken,
		page,
	}: {
		getToken: () => Promise<string | null>;
		page: string;
	}) {
		const token = await getToken();
		const res = await fetch(`${this.apiv1}/category?page=${page}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (!res.ok) {
			throw new Error(`${res.statusText}, ${res.status}`);
		}
		const json = await res.json();
		const parsedSchema = z.array(
			z.object({
				id: z.number(),
				name: z.string(),
			}),
		);
		return parsedSchema.parse(json);
	}

	postCategory({
		formData,
		token,
	}: {
		formData: FormData;
		token: string | null;
	}) {
		const name = formData.get("name");
		if (!name) {
			throw new Error("name is invalid");
		}
		return fetch(`${this.apiv1}/category`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name }),
		});
	}

	patchCategory({
		formData,
		id,
		token,
	}: {
		formData: FormData;
		id?: string;
		token: string | null;
	}) {
		if (!id) {
			throw new Error("id is invalid");
		}
		const name = formData.get("name");
		if (!name) {
			throw new Error("name is invalid");
		}
		return fetch(`${this.apiv1}/category/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name }),
		});
	}

	deleteCategory({ id, token }: { id: number; token: string | null }) {
		return fetch(`${this.apiv1}/category/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	async getItems({
		categoryId,
		getToken,
		page,
	}: {
		categoryId?: string;
		getToken: () => Promise<string | null>;
		page: string;
	}) {
		const token = await getToken();
		if (!categoryId) {
			throw new Error("id is invalid");
		}
		const res = await fetch(
			`${this.apiv1}/category/${categoryId}/item?page=${page}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		if (!res.ok) {
			throw new Error(`${res.statusText}, ${res.status}`);
		}
		const json = await res.json();
		const parsedSchema = z.array(
			z.object({
				id: z.number(),
				name: z.string(),
				categoryId: z.number(),
				pages: z.number(),
				currentPage: z.number(),
			}),
		);
		return parsedSchema.parse(json);
	}

	async getItem({
		id,
		getToken,
	}: {
		id?: string;
		getToken: () => Promise<string | null>;
	}) {
		const token = await getToken();
		const res = await fetch(`${this.apiv1}/item/${id}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (!res.ok) {
			throw new Error(`${res.statusText}, ${res.status}`);
		}
		const json = await res.json();
		const parsedSchema = z.object({
			id: z.number(),
			name: z.string(),
			categoryId: z.number(),
			pages: z.number(),
			currentPage: z.number(),
		});
		return parsedSchema.parse(json);
	}

	postItem({
		formData,
		categoryId,
		token,
	}: {
		formData: FormData;
		categoryId?: string;
		token: string | null;
	}) {
		if (!categoryId) {
			throw new Error("categoryId is invalid");
		}
		const cidn = Number.parseInt(categoryId, 10);
		const pages = Number(formData.get("pages"));
		const currentPage = Number(formData.get("currentPage"));
		if (Number.isNaN(cidn)) {
			throw new Error("categoryId is invalid");
		}
		return fetch(`${this.apiv1}/item`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: formData.get("name"),
				categoryId: cidn,
				pages: pages,
				currentPage: currentPage,
			}),
		});
	}

	patchItem({
		formData,
		categoryId,
		id,
		token,
	}: {
		formData: FormData;
		categoryId?: string;
		id?: string;
		token: string | null;
	}) {
		if (!categoryId) {
			throw new Error("categoryId is invalid");
		}
		const cidn = Number.parseInt(categoryId, 10);
		const pages = Number(formData.get("pages"));
		const currentPage = Number(formData.get("currentPage"));
		if (Number.isNaN(cidn)) {
			throw new Error("categoryId is invalid");
		}
		return fetch(`${this.apiv1}/item/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: formData.get("name"),
				categoryId: cidn,
				pages: pages,
				currentPage: currentPage,
			}),
		});
	}

	deleteItem({ id, token }: { id: number; token: string | null }) {
		return fetch(`${this.apiv1}/item/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
}

export const api = new Apiv1(getApiv1());
