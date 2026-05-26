import { LoginForm } from "@/components/ui/login-form";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import BaseLayout from "@/components/core/BaseLayout";

export default function Home() {
  const location = useLocation();
  const state = location.state;
  useEffect(() => {
    if (state?.success === false) {
      toast.error("header value is invalid");
    }
  }, [state?.success]);
  return (
    <BaseLayout title="Welcome!">
      <LoginForm className="min-w-80" />
    </BaseLayout>
  );
}
