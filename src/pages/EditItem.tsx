import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { toast } from "sonner";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function EditItem() {
  const navigate = useNavigate();

  const { categoryId, id } = useParams();

  const queryClient = useQueryClient();

  const [getToken] =
    useOutletContext<[getToken: () => Promise<null | string>]>();

  const mutation = useMutation({
    mutationFn: ({
      formData,
      categoryId,
      id,
      token,
    }: {
      formData: FormData;
      categoryId: string | undefined;
      id: string | undefined;
      token: string | null;
    }) => {
      return api.patchItem({ formData, categoryId, id, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category", categoryId, "items"],
      });
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      return await api.getItem({ id, getToken });
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isPending) {
    return <BaseSpinner />;
  }

  return (
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
                    formData: new FormData(e.currentTarget),
                    categoryId,
                    id,
                    token,
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
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={data?.name}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="currentPage">CurrentPage</FieldLabel>
                  <Input
                    id="currentPage"
                    name="currentPage"
                    type="number"
                    defaultValue={data?.currentPage}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pages">Pages</FieldLabel>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    defaultValue={data?.pages}
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
  );
}
