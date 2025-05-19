
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page not found</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 inline-block">
            {location.pathname}
          </span>
        </p>
        <Button asChild className="flex items-center gap-2 mx-auto">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
