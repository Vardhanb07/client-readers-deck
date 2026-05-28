import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, SquarePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { getHeaders } from "@/lib/utils";

export default function Items() {
  const { categoryId } = useParams();

  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["category", categoryId, "items"],
    queryFn: async () => {
      const headers = getHeaders();
      if (!categoryId) {
        throw new Error("id is invalid");
      }
      const res = await fetch(
        `${import.meta.env.VITE_API}/category/${categoryId}/item`,
        {
          method: "GET",
          headers: headers,
        },
      );
      const json = await res.json();
      const parsedSchema = z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          categoryId: z.number(),
          pages: z.number(),
          currentPage: z.number(),
        }),
      );
      const parsed = parsedSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("header is invalid");
      }
      return parsed.data;
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const mutation = useMutation({
    mutationFn: (id: number) => {
      if (!id) {
        throw new Error("id is invalid");
      }
      const headers = getHeaders();
      return fetch(`/api/item/${id}`, {
        method: "DELETE",
        headers: headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category", categoryId, "items"],
      });
    },
  });

  if (isPending) {
    return <BaseSpinner />;
  }

  return (
    <BaseLayout title="Items">
      <div className="mb-3">
        <Link to={"add"} replace>
          <SquarePlus />
        </Link>
      </div>
      <div className="flex flex-col w-full h-full">
        {data?.map((val) => {
          return (
            <Item key={val.id}>
              <ItemContent>{val.name}</ItemContent>
              <ItemActions>
                <Link to={`${val.id}/edit`} replace>
                  <Edit />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    mutation.mutate(val.id);
                  }}
                  className="cursor-pointer"
                >
                  <Trash2 />
                </button>
              </ItemActions>
            </Item>
          );
        })}
      </div>
    </BaseLayout>
  );
}
