import { Route } from "react-router";
import { Routes } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ui/theme-provider";
import ProtectRoute from "./components/core/ProtectRoute";
import Dash from "./pages/Dash";
import Items from "./pages/Items";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditCategory from "./pages/EditCategory";
import EditItem from "./pages/EditItem";
import AddCategory from "./pages/AddCategory";
import AddItem from "./pages/AddItem";

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
          path="category/:id/items"
          element={
            <ProtectRoute>
              <Items />
            </ProtectRoute>
          }
        />
        <Route
          path="category/:id/items/add"
          element={
            <ProtectRoute>
              <AddItem />
            </ProtectRoute>
          }
        />
        <Route
          path="category/:id/items/:id/edit"
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
