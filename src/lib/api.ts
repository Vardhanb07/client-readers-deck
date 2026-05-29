import * as z from "zod";
import { getApiv1, getHeaders } from "./utils";

class Apiv1 {
	#apiv1 = "";
	#headers = {};
	constructor(apiv1: string, headers: { [index: string]: string }) {
		this.#apiv1 = apiv1;
		this.#headers = headers;
	}
	async getCategories() {
		const res = await fetch(`${this.#apiv1}/category`, {
			method: "GET",
			headers: this.#headers,
		});
		const json = await res.json();
		const parsedSchema = z.array(
			z.object({
				id: z.number(),
				name: z.string(),
			}),
		);
		const parsed = parsedSchema.safeParse(json);
		if (!parsed) {
			throw new Error("header is invalid");
		}
		return parsed.data;
	}
	postCategory({ formData }: { formData: FormData }) {
		const name = formData.get("name");
		if (!name) {
			throw new Error("name is invalid");
		}
		return fetch(`${this.#apiv1}/category`, {
			method: "POST",
			headers: {
				...this.#headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});
	}
	patchCategory({
		formData,
		id,
	}: {
		formData: FormData;
		id: string | undefined;
	}) {
		if (!id) {
			throw new Error("id is invalid");
		}
		const name = formData.get("name");
		if (!name) {
			throw new Error("name is invalid");
		}
		return fetch(`${this.#apiv1}/category/${id}`, {
			method: "PATCH",
			headers: {
				...this.#headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});
	}
	deleteCategory({ id }: { id: number }) {
		return fetch(`${this.#apiv1}/category/${id}`, {
			method: "DELETE",
			headers: this.#headers,
		});
	}
	async getItems({ categoryId }: { categoryId: string | undefined }) {
		if (!categoryId) {
			throw new Error("id is invalid");
		}
		const res = await fetch(`${this.#apiv1}/category/${categoryId}/item`, {
			method: "GET",
			headers: this.#headers,
		});
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
		const parsed = parsedSchema.safeParse(json);
		if (!parsed.success) {
			throw new Error("header is invalid");
		}
		return parsed.data;
	}
	async getItem({ id }: { id: string | undefined }) {
		const res = await fetch(`${this.#apiv1}/item/${id}`, {
			method: "GET",
			headers: this.#headers,
		});
		const json = await res.json();
		const parsedSchema = z.object({
			id: z.number(),
			name: z.string(),
			categoryId: z.number(),
			pages: z.number(),
			currentPage: z.number(),
		});
		const parsed = parsedSchema.safeParse(json);
		if (!parsed.success) {
			throw new Error("header is invalid");
		}
		return parsed.data;
	}
	postItem({
		formData,
		categoryId,
	}: {
		formData: FormData;
		categoryId: string | undefined;
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
		return fetch(`${this.#apiv1}/item`, {
			method: "POST",
			headers: {
				...this.#headers,
				"Content-Type": "application/json",
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
	}: {
		formData: FormData;
		categoryId: string | undefined;
		id: string | undefined;
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
		return fetch(`${this.#apiv1}/item/${id}`, {
			method: "PATCH",
			headers: {
				...this.#headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: formData.get("name"),
				categoryId: cidn,
				pages: pages,
				currentPage: currentPage,
			}),
		});
	}
	deleteItem({ id }: { id: number }) {
		return fetch(`${this.#apiv1}/item/${id}`, {
			method: "DELETE",
			headers: this.#headers,
		});
	}
}

export const api = new Apiv1(getApiv1(), getHeaders());
