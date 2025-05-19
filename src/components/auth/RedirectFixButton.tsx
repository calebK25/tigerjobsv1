import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const RedirectFixButton = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleFixRedirectIssues = async () => {
    try {
      setIsFixing(true);
      toast.info('Fixing redirect issues...');
      
      // 1. Clear all localStorage items
      localStorage.clear();
      
      // 2. Clear all sessionStorage items
      sessionStorage.clear();
      
      // 3. Clear all cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // 4. Sign out globally from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // 5. Force page reload with cache bust parameter
      toast.success('Redirect issues fixed! Reloading page...');
      setTimeout(() => {
        window.location.href = '/login?clearcache=' + new Date().getTime();
      }, 1500);
    } catch (error) {
      console.error('Error fixing redirect issues:', error);
      toast.error('Failed to fix redirect issues. Please try again.');
      setIsFixing(false);
    }
  };
  
  const handleAdvancedFix = async () => {
    try {
      setIsFixing(true);
      toast.info('Applying advanced fix...');
      
      // Redirect to our dedicated reset page
      window.location.href = '/reset-auth.html';
    } catch (error) {
      console.error('Error applying advanced fix:', error);
      toast.error('Advanced fix failed. Please try again.');
      setIsFixing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-amber-500">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-xs">Experiencing redirect issues?</p>
      </div>
      
      <Button
        variant="destructive"
        onClick={handleFixRedirectIssues}
        disabled={isFixing}
        className="w-full"
      >
        {isFixing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fixing...
          </>
        ) : (
          "Fix Login Redirect Issues"
        )}
      </Button>
      
      <div className="pt-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)} 
          className="text-xs text-gray-500 hover:text-gray-400 underline"
        >
          {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        </button>
        
        {showAdvanced && (
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={handleAdvancedFix}
              disabled={isFixing}
              className="w-full text-amber-500 border-amber-800 hover:bg-amber-950"
            >
              Apply Advanced Fix
            </Button>
            <p className="text-[10px] text-gray-500 mt-1">
              Use this if the standard fix doesn't work. This performs additional steps to force reset your authentication.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 