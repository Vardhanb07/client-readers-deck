import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, ExternalLink, SquarePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { getApiv1, getHeaders } from "@/lib/utils";

export default function Dash() {
	const queryClient = useQueryClient();
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const headers = getHeaders();
			const apiv1 = getApiv1();
			const res = await fetch(`${apiv1}/category`, {
				method: "GET",
				headers: headers,
			});
			const json = await res.json();
			const parsedSchema = z.array(
				z.object({
					id: z.number(),
					name: z.string(),
				}),
			);
			const parsed = parsedSchema.safeParse(json);
			if (!parsed.success) {
				throw new Error("header is invalid");
			}
			return parsed.data;
		},
	});

	useEffect(() => {
		if (isError && error) {
			toast.error(error.message, {
				id: "error-toast",
			});
		}
	}, [isError, error]);

	const mutation = useMutation({
		mutationFn: (id: number) => {
			const headers = getHeaders();
			const apiv1 = getApiv1();
			return fetch(`${apiv1}/category/${id}`, {
				method: "DELETE",
				headers: headers,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			});
		},
	});

	if (isPending) {
		return <BaseSpinner />;
	}

	return (
		<BaseLayout title="Categories">
			<div className="mb-3">
				<Link to={"category/add"} replace>
					<SquarePlus />
				</Link>
			</div>
			<div className="flex flex-col w-full h-full">
				{data?.map((val) => {
					return (
						<Item key={val.id}>
							<ItemContent>{val.name}</ItemContent>
							<ItemActions>
								<Link to={`category/${val.id}/edit`} replace>
									<Edit />
								</Link>
								<button
									type="button"
									onClick={() => {
										mutation.mutate(val.id);
									}}
									className="cursor-pointer"
								>
									<Trash2 />
								</button>
								<Link to={`category/${val.id}/items`} replace>
									<ExternalLink />
								</Link>
							</ItemActions>
						</Item>
					);
				})}
			</div>
		</BaseLayout>
	);
}
