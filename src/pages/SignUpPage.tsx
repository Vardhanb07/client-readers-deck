import BaseLayout from "@/components/core/BaseLayout";
import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <BaseLayout title="" signInOrOutScreen={true}>
      <SignUp />
    </BaseLayout>
  );
}
