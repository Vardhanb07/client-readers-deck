import { Spinner } from "@/components/ui/spinner";

export default function BaseSpinner() {
	return (
		<div className="flex w-screen h-screen justify-center items-center">
			<Spinner className="size-8" />
		</div>
	);
}
