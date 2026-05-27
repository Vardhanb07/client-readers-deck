import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import ProtectRoute from "./components/core/ProtectRoute";
import { ThemeProvider } from "./components/ui/theme-provider";
import AddCategory from "./pages/AddCategory";
import AddItem from "./pages/AddItem";
import Dash from "./pages/Dash";
import EditCategory from "./pages/EditCategory";
import EditItem from "./pages/EditItem";
import Home from "./pages/Home";
import Items from "./pages/Items";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/dash">
				<Route
					index
					element={
						<ProtectRoute>
							<Dash />
						</ProtectRoute>
					}
				/>
				<Route
					path="category/add"
					element={
						<ProtectRoute>
							<AddCategory />
						</ProtectRoute>
					}
				/>
				<Route
					path="category/:id/edit"
					element={
						<ProtectRoute>
							<EditCategory />
						</ProtectRoute>
					}
				/>
				<Route
					path="category/:categoryId/items"
					element={
						<ProtectRoute>
							<Items />
						</ProtectRoute>
					}
				/>
				<Route
					path="category/:categoryId/items/add"
					element={
						<ProtectRoute>
							<AddItem />
						</ProtectRoute>
					}
				/>
				<Route
					path="category/:categoryId/items/:id/edit"
					element={
						<ProtectRoute>
							<EditItem />
						</ProtectRoute>
					}
				/>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AppRouter />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
