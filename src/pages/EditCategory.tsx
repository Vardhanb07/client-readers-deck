import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function EditCategory() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({
			formData,
			id,
		}: {
			formData: FormData;
			id: string | undefined;
		}) => {
			return api.patchCategory({ formData, id });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
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
						<CardTitle>Edit category</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.target);
								mutation.mutate({ formData, id });
								navigate("/dash");
							}}
						>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" type="text" required />
								</Field>
								<Field>
									<Button type="submit">Edit</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
			<div>
				<Button>
					<Link to={"/dash"}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
