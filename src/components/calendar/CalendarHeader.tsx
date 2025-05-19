
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CalendarHeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'unknown';
  syncing: boolean;
  onSync: () => void;
  onConnect: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  connectionStatus,
  syncing,
  onSync,
  onConnect,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your interview schedule
          </p>
        </div>
        <div className="flex gap-2">
          {connectionStatus === 'connected' && (
            <Button 
              onClick={onSync}
              disabled={syncing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}
          <Button 
            onClick={onConnect} 
            disabled={syncing}
            variant={connectionStatus === 'connected' ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {connectionStatus === 'connected' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : connectionStatus === 'disconnected' ? (
              <XCircle className="h-4 w-4" />
            ) : null}
            {syncing ? 'Connecting...' : connectionStatus === 'connected' ? 'Connected to Google' : 'Connect Google Calendar'}
          </Button>
        </div>
      </div>
      
      {connectionStatus === 'unknown' && (
        <Alert>
          <AlertDescription>
            Checking Google Calendar connection status...
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default CalendarHeader;
