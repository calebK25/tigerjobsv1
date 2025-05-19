import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ClearSessionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClearSession = async () => {
    try {
      setIsLoading(true);
      
      // Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Session cleared successfully. Please refresh and log in again.");
      
      // Optional: Reload the page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error) {
      console.error("Error clearing session:", error);
      toast.error("Failed to clear session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleClearSession}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Clearing...
        </>
      ) : (
        "Clear Session & Logout"
      )}
    </Button>
  );
} 