import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function AddItem() {
	const navigate = useNavigate();

	const { categoryId } = useParams();

	const [getToken] =
		useOutletContext<[getToken: () => Promise<null | string>]>();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			formData,
			categoryId,
			token,
		}: {
			formData: FormData;
			categoryId: string | undefined;
			token: string | null;
		}) => {
			return api.postItem({ formData, categoryId, token });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", categoryId, "items"],
			});
		},
	});

	return (
		<div
			className={
				"flex flex-col gap-6 w-screen h-screen justify-center items-center p-6"
			}
		>
			<div className="w-80">
				<Card>
					<CardHeader>
						<CardTitle>Add item</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								try {
									const token = await getToken();
									mutation.mutate({
										formData: new FormData(e.target),
										categoryId: categoryId,
										token: token,
									});
									navigate(`/category/${categoryId}/items`);
								} catch (err) {
									if (err instanceof Error) {
										toast.error(err.message);
									}
								}
							}}
						>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" type="text" required />
								</Field>
								<Field>
									<FieldLabel htmlFor="currentPage">CurrentPage</FieldLabel>
									<Input
										id="currentPage"
										name="currentPage"
										type="number"
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="pages">Pages</FieldLabel>
									<Input id="pages" name="pages" type="number" required />
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
					<Link to={`/category/${categoryId}/items`}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
