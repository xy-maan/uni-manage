"use client";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Clock, MapPin, Users, Pen, Trash2 } from "lucide-react";
import EditMeetingBtn from "../Btns/EditMeetingBtn/EditMeetingBtn";
import DeleteMeetingBtn from "../Btns/DeleteMeetingBtn/DeleteMeetingBtn";
import MeetingNotesSection from "./MeetingNotesSection";
import MeetingAttendanceSection from "./MeetingAttendanceSection";


function formatMeetingDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function MeetingDetailDialog({
  open,
  onClose,
  meeting: initialMeeting,
  members,
  isParticipant,
  setMeetings,
}: {
  open: boolean;
  onClose: () => void;
  meeting: any;
  members: any[];
  isParticipant: boolean;
  setMeetings: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [meeting, setMeeting] = useState(initialMeeting);

  function handleUpdated(updated: any) {
    setMeeting(updated);
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  function handleDeleted() {
    setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="flex-1">{meeting.title}</DialogTitle>
            {isParticipant && (
              <div className="flex items-center gap-1 shrink-0">
                <EditMeetingBtn meeting={meeting} members={members} setMeetings={setMeetings} />
                <DeleteMeetingBtn meeting_id={meeting.id} title={meeting.title} onDeleted={handleDeleted} />
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {meeting.description && (
            <p className="text-sm text-muted-foreground">{meeting.description}</p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              {formatMeetingDate(meeting.starts_at)}
              {meeting.ends_at && ` → ${formatMeetingDate(meeting.ends_at)}`}
            </div>
            {meeting.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                {meeting.location}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              {meeting.attendees?.length ?? 0} attendees
            </div>
          </div>

          <MeetingAttendanceSection
            meetingId={meeting.id}
            members={members}
            isParticipant={isParticipant}
          />

          <MeetingNotesSection
            meetingId={meeting.id}
            isParticipant={isParticipant}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}