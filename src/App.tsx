import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { InterviewProvider } from "@/context/InterviewContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import ApplicationsPage from "@/pages/ApplicationsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import JobSearchPage from "@/pages/JobSearchPage";
import ImportPage from "@/pages/ImportPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import CalendarPage from '@/pages/CalendarPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Get the base URL from the environment or default to "/"
const baseUrl = import.meta.env.BASE_URL || "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InterviewProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={baseUrl}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route element={<MainLayout><ProtectedRoute /></MainLayout>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* Redirect /settings to /profile */}
                <Route path="/settings" element={<Navigate to="/profile" replace />} />
              </Route>
              
              <Route path="/unauthorized" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InterviewProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
