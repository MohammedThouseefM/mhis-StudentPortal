'use client';

import { useEffect, useState, memo } from 'react';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getQuote } from '@/lib/actions';

function MotivationalQuoteComponent() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      setLoading(true);
      const result = await getQuote();
      setQuote(result.data);
      setLoading(false);
    }
    fetchQuote();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <span>Quote of the Day</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <blockquote className="border-l-2 pl-6 italic">
            {quote}
          </blockquote>
        )}
      </CardContent>
    </Card>
  );
}

export const MotivationalQuote = memo(MotivationalQuoteComponent);
