import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {Link, useNavigate, useOutletContext, useParams} from "react-router";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {api} from "@/lib/api";
import {useErrorBoundary} from "react-error-boundary";
import {Suspense} from "react"
import BaseSpinner from "@/components/core/BaseSpinner.tsx";

export function EditItem() {
    const navigate = useNavigate();

    const {categoryId, id} = useParams();

    const queryClient = useQueryClient();

    const [getToken] =
        useOutletContext<[getToken: () => Promise<string | null>]>();

    const {showBoundary} = useErrorBoundary()

    const mutation = useMutation({
        mutationFn: ({
                         formData,
                         categoryId,
                         id,
                         token,
                     }: {
            formData: FormData;
            categoryId?: string;
            id?: string;
            token: string | null;
        }) => {
            return api.patchItem({formData, categoryId, id, token});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["category", categoryId, "items"],
            });
        },
    });


    const {data} = useSuspenseQuery({
        queryKey: ["item", id],
        queryFn: async () => {
            return await api.getItem({id, getToken})
        }
    })

    return (
        <Suspense fallback={<BaseSpinner/>}>
            <div
                className={
                    "flex flex-col gap-6 w-screen h-screen justify-center items-center p-6"
                }
            >
                <div className="w-80">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const token = await getToken();
                                        mutation.mutate({
                                            formData: new FormData(e.target),
                                            categoryId,
                                            id,
                                            token,
                                        });
                                        navigate(`/category/${categoryId}/items`);
                                    } catch (error: unknown) {
                                        showBoundary(error)
                                    }
                                }}
                            >
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={data.name}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="currentPage">CurrentPage</FieldLabel>
                                        <Input
                                            id="currentPage"
                                            name="currentPage"
                                            type="number"
                                            defaultValue={data.currentPage}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="pages">Pages</FieldLabel>
                                        <Input
                                            id="pages"
                                            name="pages"
                                            type="number"
                                            defaultValue={data.pages}
                                            required
                                        />
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
        </Suspense>
    )
}
