import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Info, SquarePlus, Trash2, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router";
import { toast } from "sonner";
import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { api } from "@/lib/api";

export default function Items() {
	const { categoryId } = useParams();

	const queryClient = useQueryClient();

	const [getToken] =
		useOutletContext<[getToken: () => Promise<null | string>]>();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["category", categoryId, "items"],
		queryFn: async () => {
			return await api.getItems({ categoryId, getToken });
		},
	});

	useEffect(() => {
		if (isError && error) {
			toast.error(error.message);
		}
	}, [isError, error]);

	const mutation = useMutation({
		mutationFn: ({ id, token }: { id: number; token: string | null }) => {
			return api.deleteItem({ id, token });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", categoryId, "items"],
			});
		},
	});

	if (isPending) {
		return <BaseSpinner />;
	}

	return (
		<BaseLayout title="Items" signInOrOutScreen={false}>
			<div className="mb-3">
				<Link to={"add"} replace>
					<SquarePlus />
				</Link>
			</div>
			<div className="flex flex-col w-full h-full">
				{data?.map((val) => {
					return (
						<Item key={val.id}>
							<ItemContent>{val.name}</ItemContent>
							<ItemActions>
								<AlertDialog>
									<AlertDialogTrigger>
										<Button variant={"outline"}>
											<Info />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Description</AlertDialogTitle>
											<AlertDialogDescription>
												<p>Name: {val.name}</p>
												<p>Current page: {val.currentPage}</p>
												<p>Pages: {val.pages}</p>
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Close</AlertDialogCancel>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
								<Link to={`${val.id}/edit`} replace>
									<Edit />
								</Link>
								<AlertDialog>
									<AlertDialogTrigger>
										<Button variant="destructive">
											<Trash2 />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent size="sm">
										<AlertDialogHeader>
											<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
												<Trash2Icon />
											</AlertDialogMedia>
											<AlertDialogTitle>Delete item?</AlertDialogTitle>
											<AlertDialogDescription>
												This will permanently delete this item.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel variant="outline">
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												variant="destructive"
												onClick={async () => {
													try {
														const token = await getToken();
														mutation.mutate({ id: val.id, token });
													} catch (err) {
														if (err instanceof Error) {
															toast.error(err.message);
														}
													}
												}}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</ItemActions>
						</Item>
					);
				})}
			</div>
		</BaseLayout>
	);
}
