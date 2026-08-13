import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
	useNavigate,
	useOutletContext,
	useParams,
	useSearchParams,
} from "react-router";
import BaseSpinner from "@/components/core/BaseSpinner.tsx";
import ListRenderer from "@/components/core/ListRenderer.tsx";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { api } from "@/lib/api.ts";

export default function ItemPaginator() {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [getToken] =
		useOutletContext<[getToken: () => Promise<string | null>]>();
	const { showBoundary } = useErrorBoundary();
	const [searchParams] = useSearchParams();
	const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
	const { data } = useSuspenseQuery({
		queryKey: ["category", categoryId, "items", page],
		queryFn: async () => {
			return api.getItems({ categoryId, getToken, page: String(page) });
		},
	});
	const mutation = useMutation({
		mutationFn: ({ id, token }: { id: number; token: string | null }) => {
			return api.deleteItem({ id, token });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", categoryId, "items", page],
			});
		},
	});
	return (
		<Suspense fallback={<BaseSpinner />}>
			<ListRenderer
				list={"item"}
				data={data}
				getToken={getToken}
				mutation={mutation}
				showBoundary={showBoundary}
			/>
			<Pagination>
				<PaginationContent>
					{page > 1 && (
						<PaginationItem>
							<PaginationPrevious
								onClick={() => {
									navigate(`?page=${page - 1}`);
								}}
							/>
						</PaginationItem>
					)}
					<PaginationItem>
						<PaginationLink>{page}</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							onClick={() => {
								navigate(`?page=${page + 1}`);
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</Suspense>
	);
}
