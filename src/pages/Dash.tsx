import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {
    Edit,
    ExternalLink,
    SquarePlus,
    Trash2,
    Trash2Icon,
} from "lucide-react";
import {Link, useOutletContext} from "react-router";
import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
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
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Item, ItemActions, ItemContent} from "@/components/ui/item";
import {api} from "@/lib/api";
import {useErrorBoundary} from "react-error-boundary";
import {Suspense} from "react"

export default function Dash() {
    const queryClient = useQueryClient();

    const [getToken] =
        useOutletContext<[getToken: () => Promise<null | string>]>();

    const {showBoundary} = useErrorBoundary()

    const {data} = useSuspenseQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            return await api.getCategories(getToken)
        }
    })

    const mutation = useMutation({
        mutationFn: ({id, token}: { id: number; token: string | null }) => {
            return api.deleteCategory({id, token});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    return (
        <Suspense fallback={<BaseSpinner/>}>
            <BaseLayout title="Categories" signInOrOutScreen={false}>
                <div className="mb-3">
                    <Link to={"category/add"} replace>
                        <SquarePlus/>
                    </Link>
                </div>
                <div className="flex flex-col w-full h-full">
                    {data?.map((val) => {
                        return (
                            <Item key={val.id}>
                                <ItemContent>{val.name}</ItemContent>
                                <ItemActions>
                                    <Link to={`category/${val.id}/edit`} replace>
                                        <Edit/>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button variant="destructive">
                                                <Trash2/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent size="sm">
                                            <AlertDialogHeader>
                                                <AlertDialogMedia
                                                    className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                                    <Trash2Icon/>
                                                </AlertDialogMedia>
                                                <AlertDialogTitle>Delete category?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete this category and all items
                                                    associated with it.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel variant="outline">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        try {
                                                            const token = await getToken()
                                                            mutation.mutate({id: val.id, token})
                                                        } catch (error: unknown) {
                                                            showBoundary(error)
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <Link to={`category/${val.id}/items`} replace>
                                        <ExternalLink/>
                                    </Link>
                                </ItemActions>
                            </Item>
                        );
                    })}
                </div>
            </BaseLayout>
        </Suspense>
    );
}
