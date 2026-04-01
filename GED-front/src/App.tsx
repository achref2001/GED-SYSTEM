import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import ExplorerPage from "@/pages/explorer/ExplorerPage";
import FavoritesPage from "@/pages/favorites/FavoritesPage";
import RecentlyViewedPage from "@/pages/recent/RecentlyViewedPage";
import TemplatesPage from "@/pages/templates/TemplatesPage";
import SearchPage from "@/pages/SearchPage";
import AdminPage from "@/pages/AdminPage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import TagsPage from "@/pages/settings/TagsPage";
import ExtensionsPage from "@/pages/settings/ExtensionsPage";
import RbacPage from "@/pages/settings/RbacPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<ExplorerPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/recent" element={<RecentlyViewedPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings/tags" element={<TagsPage />} />
            <Route
              path="/settings/extensions"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ExtensionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/rbac"
              element={
                <ProtectedRoute permissions={['users.manage_roles']}>
                  <RbacPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
