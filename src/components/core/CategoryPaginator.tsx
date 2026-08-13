import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate, useOutletContext, useSearchParams } from "react-router";
import BaseSpinner from "@/components/core/BaseSpinner.tsx";
import ListRenderer from "@/components/core/ListRenderer.tsx";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/lib/api.ts";

export default function CategoryPaginator() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
	const [getToken] =
		useOutletContext<[getToken: () => Promise<string | null>]>();
	const { showBoundary } = useErrorBoundary();
	const { data } = useSuspenseQuery({
		queryKey: ["categories", page],
		queryFn: async () => {
			return await api.getCategories({
				getToken: getToken,
				page: String(page),
			});
		},
	});
	const mutation = useMutation({
		mutationFn: ({ id, token }: { id: number; token: string | null }) => {
			return api.deleteCategory({ id, token });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories", page],
			});
		},
	});
	return (
		<Suspense fallback={<BaseSpinner />}>
			<ListRenderer
				list={"category"}
				data={data}
				getToken={getToken}
				showBoundary={showBoundary}
				mutation={mutation}
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
