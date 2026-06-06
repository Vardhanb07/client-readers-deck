import { SignUp } from "@clerk/react";
import BaseLayout from "@/components/core/BaseLayout";

export default function SignUpPage() {
	return (
		<BaseLayout title="" signInOrOutScreen={true}>
			<SignUp />
		</BaseLayout>
	);
}
