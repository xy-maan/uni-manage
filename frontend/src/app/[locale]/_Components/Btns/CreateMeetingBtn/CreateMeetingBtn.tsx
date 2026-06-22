"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createMeetingSchema, CreateMeetingValues } from "@/schemas/meeting.schema";
import { CreateMeetingAction } from "@/Actions/Meetings/createMeeting.action";
import { Membership } from "@/types/team";

export default function CreateMeetingBtn({
  projectId,
  members,
  onCreated,
}: {
  projectId: number;
  members: Membership[];
  onCreated: (meeting: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<CreateMeetingValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      project: projectId,
      title: "",
      description: "",
      starts_at: "",
      ends_at: "",
      location: "",
      attendees: members.map((m: any) => m.user),
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

async function handleCreateMeeting(data: CreateMeetingValues) {
  const body: CreateMeetingValues = {
    project: data.project,
    title: data.title,
    description: data.description,
    starts_at: data.starts_at,
    attendees: data.attendees,
  };

  if (data.ends_at) body.ends_at = data.ends_at;
  if (data.location) body.location = data.location;

  const { payload, ok } = await CreateMeetingAction(body);

  if (ok) {
    onCreated(payload);
    toast.success("Meeting scheduled successfully", { position: "top-center", duration: 2000 });
    reset({
      project: projectId,
      title: "",
      description: "",
      starts_at: "",
      ends_at: "",
      location: "",
      attendees: members.map((m: any) => m.user),
    });
    setOpen(false);
  } else {
    const firstValue = Object.values(payload || {})?.[0];
    const message =
      typeof payload === "object" && payload && "detail" in payload
        ? (payload as any).detail
        : Array.isArray(firstValue) ? firstValue[0] : "Error occurred";
    toast.error(message);
  }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8">
          <Plus className="size-3.5" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleCreateMeeting)}>
            <div className="space-y-3">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Weekly supervisor sync" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Room 302 or Google Meet link" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}