import { SignIn } from "@clerk/react";

export default function SignInPage() {
	return (
		<div className="flex h-screen w-screen justify-center items-center">
			<SignIn />
		</div>
	);
}
