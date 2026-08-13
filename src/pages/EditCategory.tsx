import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function EditCategory() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [getToken] =
		useOutletContext<[getToken: () => Promise<string | null>]>();

	const queryClient = useQueryClient();

	const { showBoundary } = useErrorBoundary();

	const mutation = useMutation({
		mutationFn: ({
			formData,
			id,
			token,
		}: {
			formData: FormData;
			id?: string;
			token: string | null;
		}) => {
			return api.patchCategory({ formData, id, token });
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
							onSubmit={async (e) => {
								e.preventDefault();
								try {
									const token = await getToken();
									const formData = new FormData(e.target);
									mutation.mutate({ formData, id, token });
									navigate("/dash");
								} catch (error: unknown) {
									showBoundary(error);
								}
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
					<Link to={"/"}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
