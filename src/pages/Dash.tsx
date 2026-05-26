import BaseLayout from "@/components/core/BaseLayout";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import BaseSpinner from "@/components/core/BaseSpinner";
import * as z from "zod";
import { useEffect } from "react";
import { Edit, ExternalLink, Trash2, SquarePlus } from "lucide-react";
import { Link } from "react-router";
import { getHeaders } from "@/lib/utils";

export default function Dash() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const headers = getHeaders();
      const res = await fetch("/api/category", {
        method: "GET",
        headers: headers,
      });
      const json = await res.json();
      const dataSchema = z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      );
      const parsed = dataSchema.safeParse(json);
      if (!parsed.success) {
        console.error(parsed.error);
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
    <BaseLayout title="Categories">
      <div className="mb-3">
        <Link to={"/category/add"} replace>
          <SquarePlus />
        </Link>
      </div>
      <div className="flex flex-col w-full h-full">
        {data?.map((val) => {
          return (
            <Item key={val.id}>
              <ItemContent>{val.name}</ItemContent>
              <ItemActions>
                <Edit />
                <Trash2 />
                <ExternalLink />
              </ItemActions>
            </Item>
          );
        })}
      </div>
    </BaseLayout>
  );
}
