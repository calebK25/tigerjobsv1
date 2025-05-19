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
      
      // Remove any specific Lovable related items just to be sure
      const lovableKeys = [
        'lovable:token',
        'lovable:user',
        'lovable:session',
        'lovable:auth',
        'lovable:redirectUrl',
        'sb-*'  // Target all Supabase stored keys
      ];
      
      lovableKeys.forEach(keyPattern => {
        if (keyPattern.endsWith('*')) {
          // Handle wildcard pattern
          const prefix = keyPattern.slice(0, -1);
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith(prefix)) {
              localStorage.removeItem(key);
            }
          });
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith(prefix)) {
              sessionStorage.removeItem(key);
            }
          });
        } else {
          // Handle exact key
          localStorage.removeItem(keyPattern);
          sessionStorage.removeItem(keyPattern);
        }
      });
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Sign out from Supabase - use global scope to clear all sessions
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Session cleared successfully.");
      
      // Create a full refresh to ensure everything is reset
      setTimeout(() => {
        // Add cache-busting parameter
        window.location.href = "/login?t=" + new Date().getTime();
      }, 1000);
      
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