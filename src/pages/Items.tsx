import { SquarePlus } from "lucide-react";
import { Link } from "react-router";
import BaseLayout from "@/components/core/BaseLayout";
import ItemPaginator from "@/components/core/ItemPaginator.tsx";

export default function Items() {
	return (
		<BaseLayout title="Items" signInOrOutScreen={false}>
			<div className="mb-3">
				<Link to={"add"} replace>
					<SquarePlus />
				</Link>
			</div>
			<div className="flex flex-col w-full h-full">
				<ItemPaginator />
			</div>
		</BaseLayout>
	);
}
