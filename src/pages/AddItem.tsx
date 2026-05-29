import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function AddItem() {
	const navigate = useNavigate();

	const { categoryId } = useParams();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			formData,
			categoryId,
		}: {
			formData: FormData;
			categoryId: string | undefined;
		}) => {
			return api.postItem({ formData, categoryId });
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
							onSubmit={(e) => {
								e.preventDefault();
								mutation.mutate({
									formData: new FormData(e.currentTarget),
									categoryId: categoryId,
								});
								navigate(`/dash/category/${categoryId}/items`);
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
					<Link to={`/dash/category/${categoryId}/items`}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
