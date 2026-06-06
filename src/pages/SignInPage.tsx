import { SignIn } from "@clerk/react";
import BaseLayout from "@/components/core/BaseLayout";

export default function SignInPage() {
	return (
		<BaseLayout title="" signInOrOutScreen={true}>
			<SignIn />
		</BaseLayout>
	);
}
