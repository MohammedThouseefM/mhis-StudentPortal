
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-2xl font-bold text-primary">Loading AttendEase...</h1>
      </div>
      <p className="mt-4 text-muted-foreground">Please wait a moment.</p>
    </div>
  );
}
