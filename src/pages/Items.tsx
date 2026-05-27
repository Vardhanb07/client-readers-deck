import BaseLayout from "@/components/core/BaseLayout";
import BaseSpinner from "@/components/core/BaseSpinner";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { getHeaders } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Edit, SquarePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

export default function Items() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const headers = getHeaders();
      if (!id) {
        throw new Error("id is invalid");
      }
      const res = await fetch(`/api/category/${id}/item`, {
        method: "GET",
        headers: headers,
      });
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
                <Trash2 />
              </ItemActions>
            </Item>
          );
        })}
      </div>
    </BaseLayout>
  );
}
