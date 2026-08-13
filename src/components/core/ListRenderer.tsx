import type { UseMutationResult } from "@tanstack/react-query";
import { Edit, ExternalLink, Info, Trash2, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
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
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import type { List } from "@/lib/type";

export default function ListRenderer({
	list,
	data,
	getToken,
	mutation,
	showBoundary,
}: {
	list: List;
	data: { id: number; name: string; currentPage?: number; pages?: number }[];
	getToken: () => Promise<string | null>;
	mutation: UseMutationResult<
		Response,
		Error,
		{
			id: number;
			token: string | null;
		}
	>;
	showBoundary: (error: unknown) => void;
}) {
	return data.map((val) => (
		<Item key={val.id}>
			<ItemContent>{val.name}</ItemContent>
			<ItemActions>
				<Link
					to={
						list === "category" ? `category/${val.id}/edit` : `${val.id}/edit`
					}
					replace
				>
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
							<AlertDialogTitle>Delete {list}?</AlertDialogTitle>
							<AlertDialogDescription>
								{list === "category"
									? "This will permanently delete this category and all items associated with it."
									: "This will permanently delete this item."}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={async () => {
									try {
										const token = await getToken();
										mutation.mutate({ id: val.id, token });
									} catch (error: unknown) {
										showBoundary(error);
									}
								}}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				{list === "category" ? (
					<Link to={`category/${val.id}/items`} replace>
						<ExternalLink />
					</Link>
				) : (
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
				)}
			</ItemActions>
		</Item>
	));
}
