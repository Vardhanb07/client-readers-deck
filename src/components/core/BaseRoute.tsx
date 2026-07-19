import { useAuth } from "@clerk/react";
import { Outlet } from "react-router";
import BaseSpinner from "@/components/core/BaseSpinner";
import SignInPage from "@/pages/SignInPage";

export default function BaseRoute() {
	const { isLoaded, isSignedIn, getToken } = useAuth();
	if (!isLoaded) {
		return <BaseSpinner />;
	}
	if (!isSignedIn) {
		return <SignInPage />;
	}
	return <Outlet context={[getToken]} />;
}
