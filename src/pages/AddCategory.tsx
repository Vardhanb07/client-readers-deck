import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Link, useNavigate, useOutletContext} from "react-router";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {api} from "@/lib/api";
import {useErrorBoundary} from "react-error-boundary"

export default function AddCategory() {
    const navigate = useNavigate();

    const [getToken] =
        useOutletContext<[getToken: () => Promise<string | null>]>();

    const queryClient = useQueryClient();

    const {showBoundary} = useErrorBoundary()

    const mutation = useMutation({
        mutationFn: ({
                         formData,
                         token,
                     }: {
            formData: FormData;
            token: string | null;
        }) => {
            return api.postCategory({formData, token});
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
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const token = await getToken();
                                    const formData = new FormData(e.target);
                                    mutation.mutate({formData, token});
                                    navigate("/");
                                } catch (error: unknown) {
                                    showBoundary(error)
                                }
                            }}
                        >
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input id="name" name="name" type="text" required/>
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
                    <Link to={"/"}>Go Back</Link>
                </Button>
            </div>
        </div>
    );
}
