import { useAuth } from "@clerk/react";
import { Outlet } from "react-router";
import SignInPage from "@/pages/SignInPage";
import BaseSpinner from "./BaseSpinner";

export default function BaseRoute() {
	const { isLoaded, isSignedIn } = useAuth();
	if (!isLoaded) {
		return <BaseSpinner />;
	}
	if (!isSignedIn) {
		return <SignInPage />;
	}
	return <Outlet />;
}
