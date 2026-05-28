import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiv1, getHeaders } from "@/lib/utils";

export default function AddCategory() {
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (name: FormDataEntryValue | null) => {
			if (!name) {
				throw new Error("name is invalid");
			}
			const apiv1 = getApiv1();
			const headers = getHeaders();
			return fetch(`${apiv1}/category`, {
				method: "POST",
				headers: {
					...headers,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});
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
						<CardTitle>Add category</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const data = new FormData(e.currentTarget);
								mutation.mutate(data.get("name"));
								navigate("/dash");
							}}
						>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" type="text" required />
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
					<Link to={"/dash"}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
