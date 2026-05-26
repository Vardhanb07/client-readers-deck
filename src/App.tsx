import { Route } from "react-router";
import { Routes } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ui/theme-provider";
import ProtectRoute from "./components/core/ProtectRoute";
import Dash from "./pages/Dash";
import Items from "./pages/Items";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <Route path="category">
          <Route
            path=":id/items"
            element={
              <ProtectRoute>
                <Items />
              </ProtectRoute>
            }
          />
          <Route path="add" />
        </Route>
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
