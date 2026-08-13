import { ClerkProvider } from "@clerk/react";
import { shadcn } from "@clerk/ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router";
import BaseErrorPage from "@/components/core/BaseErrorPage.tsx";
import BaseRoute from "@/components/core/BaseRoute";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getClerkPushableKey } from "@/lib/utils";
import AddCategory from "@/pages/AddCategory";
import AddItem from "@/pages/AddItem";
import Dash from "@/pages/Dash";
import EditCategory from "@/pages/EditCategory";
import { EditItem } from "@/pages/EditItem";
import Items from "@/pages/Items";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";

const queryClient = new QueryClient();

function RootLayout() {
	const navigate = useNavigate();
	return (
		<ClerkProvider
			publishableKey={getClerkPushableKey()}
			routerPush={(to) => navigate(to)}
			routerReplace={(to) => navigate(to, { replace: true })}
			signInUrl="/sign-in"
			signUpUrl="/sign-up"
			signInFallbackRedirectUrl="/"
			signUpForceRedirectUrl="/"
			appearance={{
				theme: shadcn,
			}}
		>
			<Routes>
				<Route element={<BaseRoute />}>
					<Route index element={<Dash />} />
					<Route path="category/add" element={<AddCategory />} />
					<Route path="category/:id/edit" element={<EditCategory />} />
					<Route path="category/:categoryId/items" element={<Items />} />
					<Route path="category/:categoryId/items/add" element={<AddItem />} />
					<Route
						path="category/:categoryId/items/:id/edit"
						element={<EditItem />}
					/>
				</Route>
				<Route path="/sign-in" element={<SignInPage />} />
				<Route path="/sign-up" element={<SignUpPage />} />
				<Route
					path="*"
					element={
						<BaseErrorPage errorCode={404} errorMessage={"Page not found"} />
					}
				/>
			</Routes>
		</ClerkProvider>
	);
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ErrorBoundary
					fallbackRender={({ error }) => {
						return <BaseErrorPage errorMessage={getErrorMessage(error)} />;
					}}
				>
					<RootLayout />
				</ErrorBoundary>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
