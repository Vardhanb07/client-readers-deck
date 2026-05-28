import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiv1, getHeaders } from "@/lib/utils";

export default function EditItem() {
	const navigate = useNavigate();

	const { categoryId, id } = useParams();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (formData: FormData) => {
			if (!categoryId) {
				throw new Error("categoryId is invalid");
			}
			const headers = getHeaders();
			const cidn = Number.parseInt(categoryId, 10);
			const pages = Number(formData.get("pages"));
			const currentPage = Number(formData.get("currentPage"));
			if (Number.isNaN(cidn)) {
				throw new Error("categoryId is invalid");
			}
			const apiv1 = getApiv1();
			return fetch(`${apiv1}/item/${id}`, {
				method: "PATCH",
				headers: {
					...headers,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.get("name"),
					categoryId: cidn,
					pages: pages,
					currentPage: currentPage,
				}),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", categoryId, "items"],
			});
		},
	});

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["item", id],
		queryFn: async () => {
			const headers = getHeaders();
			const apiv1 = getApiv1();
			const res = await fetch(`${apiv1}/item/${id}`, {
				method: "GET",
				headers: headers,
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
		},
	});

	useEffect(() => {
		if (isError && error) {
			toast.error(error.message);
		}
	}, [isError, error]);

	if (isPending) {
		return <BaseSpinner />;
	}

	return (
		<div
			className={
				"flex flex-col gap-6 w-screen h-screen justify-center items-center p-6"
			}
		>
			<div className="w-80">
				<Card>
					<CardHeader>
						<CardTitle>Edit item</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								mutation.mutate(new FormData(e.currentTarget));
								navigate(`/dash/category/${categoryId}/items`);
							}}
						>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										id="name"
										name="name"
										type="text"
										defaultValue={data?.name}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="currentPage">CurrentPage</FieldLabel>
									<Input
										id="currentPage"
										name="currentPage"
										type="number"
										defaultValue={data?.currentPage}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="pages">Pages</FieldLabel>
									<Input
										id="pages"
										name="pages"
										type="number"
										defaultValue={data?.pages}
										required
									/>
								</Field>
								<Field>
									<Button type="submit">Add</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
			<div>
				<Button>
					<Link to={`/dash/category/${categoryId}/items`}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
