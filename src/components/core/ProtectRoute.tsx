import { Navigate } from "react-router";
import * as z from "zod";

export default function ProtectRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerSchema = z.object({
    key: z.string(),
    value: z.string(),
  });
  const headerVal = localStorage.getItem("header");
  if (!headerVal) {
    return <Navigate to={"/"} state={{ success: false }} replace />;
  }
  const header = headerSchema.safeParse(JSON.parse(headerVal));
  if (!header.success) {
    return <Navigate to={"/"} state={{ success: false }} replace />;
  }
  return children;
}
