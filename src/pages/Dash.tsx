import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, ExternalLink, SquarePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { api } from "@/lib/api";

export default function Dash() {
	const queryClient = useQueryClient();
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return await api.getCategories();
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
		mutationFn: ({ id }: { id: number }) => {
			return api.deleteCategory({ id });
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
										mutation.mutate({ id: val.id });
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
