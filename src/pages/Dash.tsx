import BaseLayout from "@/components/core/BaseLayout";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Item, ItemContent } from "@/components/ui/item";
import BaseSpinner from "@/components/core/BaseSpinner";
import * as z from "zod";

export default function Dash() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/category`, {
        method: "GET",
        headers: {},
      });
      const dataSchema = z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      );
      const data = dataSchema.safeParse(await res.json());
      if (!data.success) {
        throw new Error("header is invalid");
      }
      return data.data;
    },
  });

  if (isPending) {
    return <BaseSpinner />;
  }

  if (isError) {
    toast.error(error.message);
  }

  return (
    <BaseLayout title="Categories">
      {data?.map((val, idx) => {
        return (
          <Item key={val.id}>
            <ItemContent>{val.name}</ItemContent>
          </Item>
        );
      })}
    </BaseLayout>
  );
}
