
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { PlusCircle, Pencil, Trash2, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCollegeData, type CalendarEventWithId } from '@/context/college-data-context';

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  date: z.string().min(1, 'An event date is required.'),
  type: z.enum(['holiday', 'exam', 'assignment', 'event']),
  description: z.string().optional(),
});
type EventFormData = z.infer<typeof eventSchema>;

export default function AcademicSettingsPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    const { events, addEvent, updateEvent, deleteEvent } = useCollegeData();
    const [isEventFormDialogOpen, setIsEventFormDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEventWithId | null>(null);
    const eventForm = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            type: 'event',
            description: '',
            date: '',
        },
    });

    const onEventSubmit = (data: EventFormData) => {
        const eventData = { ...data };
        if (editingEvent) {
            updateEvent(editingEvent.id, eventData, currentTeacherId);
            toast({ title: 'Event Updated' });
        } else {
            addEvent(eventData, currentTeacherId);
            toast({ title: 'Event Added' });
        }
        setIsEventFormDialogOpen(false);
        setEditingEvent(null);
    };

    const handleAddEventClick = () => {
        setEditingEvent(null);
        eventForm.reset({ title: '', date: '', type: 'event', description: '' });
        setIsEventFormDialogOpen(true);
    };

    const handleEditEventClick = (event: CalendarEventWithId) => {
        setEditingEvent(event);
        eventForm.reset({
            title: event.title,
            date: event.date,
            type: event.type,
            description: event.description || ''
        });
        setIsEventFormDialogOpen(true);
    };

    const handleDeleteEventSubmit = (eventId: string, eventTitle: string) => {
        deleteEvent(eventId, eventTitle, currentTeacherId);
        toast({ variant: 'destructive', title: 'Event Deleted' });
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-6 w-6" /> Academic Calendar Settings</CardTitle>
                    <CardDescription>Manage important dates like exams, holidays, and assignment deadlines.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button onClick={handleAddEventClick}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{format(parseISO(event.date), 'dd-MM-yyyy')}</TableCell>
                                        <TableCell><span className="capitalize">{event.type}</span></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditEventClick(event)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will permanently delete the event "{event.title}".</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteEventSubmit(event.id, event.title)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEventFormDialogOpen} onOpenChange={setIsEventFormDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        <DialogDescription>Fill in the details for the academic event.</DialogDescription>
                    </DialogHeader>
                    <Form {...eventForm}>
                        <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4 py-4">
                            <FormField control={eventForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Mid-term Exams" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={eventForm.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            <FormField control={eventForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="exam">Exam</SelectItem><SelectItem value="holiday">Holiday</SelectItem><SelectItem value="assignment">Assignment</SelectItem><SelectItem value="event">Event</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={eventForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Add a short description..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEventFormDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
