
'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Megaphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';

export default function AnnouncementsPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
    const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
    
    const { announcements, addAnnouncement, deleteAnnouncement } = useCollegeData();

    const handleAddAnnouncementSubmit = () => {
        if (newAnnouncementTitle && newAnnouncementContent) {
            addAnnouncement(newAnnouncementTitle, newAnnouncementContent, currentTeacherId);
            toast({ title: 'Announcement Added' });
            setNewAnnouncementTitle('');
            setNewAnnouncementContent('');
        }
    };
    
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Megaphone className="h-6 w-6" /> Announcements</CardTitle>
                    <CardDescription>Create new announcements and manage existing ones.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-semibold text-lg">Create New Announcement</h3>
                            <div className="space-y-2">
                                <Label htmlFor="new-announcement-title">Title</Label>
                                <Input id="new-announcement-title" value={newAnnouncementTitle} onChange={(e) => setNewAnnouncementTitle(e.target.value)} placeholder="e.g., Mid-term Exams"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-announcement-content">Content</Label>
                                <Textarea id="new-announcement-content" value={newAnnouncementContent} onChange={(e) => setNewAnnouncementContent(e.target.value)} placeholder="Enter the announcement details here..."/>
                            </div>
                            <Button onClick={handleAddAnnouncementSubmit} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> Post Announcement
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Existing Announcements</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {announcements.length > 0 ? (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="flex items-start justify-between gap-4 p-3 rounded-md border bg-card-foreground/5">
                                            <div className="flex-1">
                                                <p className="font-medium">{announcement.title}</p>
                                                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive shrink-0 hover:bg-destructive/10 h-8 w-8" onClick={() => deleteAnnouncement(announcement.id, currentTeacherId)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
