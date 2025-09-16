'use client';

import { memo } from 'react';
import { Megaphone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollegeData } from '@/context/college-data-context';

function AnnouncementsComponent() {
  const { announcements } = useCollegeData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          <span>Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 rounded-lg border bg-card-foreground/5">
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No announcements have been posted yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export const Announcements = memo(AnnouncementsComponent);
