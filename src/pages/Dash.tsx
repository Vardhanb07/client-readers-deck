import { SquarePlus } from "lucide-react";
import { Link } from "react-router";
import BaseLayout from "@/components/core/BaseLayout";
import CategoryPaginator from "@/components/core/CategoryPaginator.tsx";

export default function Dash() {
	return (
		<BaseLayout title="Categories" signInOrOutScreen={false}>
			<div className="mb-3">
				<Link to={"category/add"} replace>
					<SquarePlus />
				</Link>
			</div>
			<div className="flex flex-col w-full h-full">
				<CategoryPaginator />
			</div>
		</BaseLayout>
	);
}
