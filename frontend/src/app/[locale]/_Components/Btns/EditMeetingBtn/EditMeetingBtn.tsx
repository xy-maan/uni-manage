// Btns/EditMeetingBtn/EditMeetingBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { UpdateMeetingAction } from "@/Actions/Meetings/updateMeeting.action";

export default function EditMeetingBtn({
  meeting,
  members,
  setMeetings,
}: {
  meeting: any;
  members: any[];
  setMeetings: (meetings: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description ?? "");
  const [startsAt, setStartsAt] = useState(meeting.starts_at?.slice(0, 16) ?? "");
  const [endsAt, setEndsAt] = useState(meeting.ends_at?.slice(0, 16) ?? "");
  const [location, setLocation] = useState(meeting.location ?? "");

  async function handleSave() {
    setLoading(true);
    const { payload, ok } = await UpdateMeetingAction(meeting.id, {
      title, description, starts_at: startsAt, ends_at: endsAt, location,
    });
    setLoading(false);

    if (ok) {
      setMeetings((prev: any) => prev.map((m: any) => (m.id === meeting.id ? payload : m)));
      toast.success("Meeting updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update meeting", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Pen className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="py-0 h-8" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}