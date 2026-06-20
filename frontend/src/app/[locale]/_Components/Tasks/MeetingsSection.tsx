// // MeetingsSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { toast } from "sonner";
// import CreateMeetingBtn from "../Btns/CreateMeetingBtn/CreateMeetingBtn";
// import EditMeetingBtn from "../Btns/EditMeetingBtn/EditMeetingBtn";
// import DeleteMeetingBtn from "../Btns/DeleteMeetingBtn/DeleteMeetingBtn";
// import MeetingAttendanceSection from "./MeetingAttendanceSection";
// import MeetingNotesSection from "./MeetingNotesSection";
// import { GetMeetingsAction } from "@/Actions/Meetings/getMeetings.action";
// import { Membership } from "@/types/team";

// export default function MeetingsSection({
//   projectId,
//   members,
//   isParticipant,
//   currentUserEmail,
// }: {
//   projectId: number;
//   members: Membership[];
//   isParticipant: boolean;
//   currentUserEmail: string;
// }) {
//   const [meetings, setMeetings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadMeetings() {
//     setLoading(true);
//     const { ok, payload } = await GetMeetingsAction();
//     if (ok) {
//       setMeetings(payload.filter((m: any) => m.project === projectId));
//     } else {
//       toast.error("Failed to load meetings", { position: "top-center", duration: 2000 });
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadMeetings();
//   }, [projectId]);

//   if (loading) return <p className="text-sm text-muted-foreground">Loading meetings...</p>;

//   return (
//     <Card className="p-0 mb-5">
//       <CardHeader className="p-6 pb-3 flex items-center justify-between">
//         <h4 className="text-sm">Meetings ({meetings.length})</h4>
//         {isParticipant && (
//           <CreateMeetingBtn
//             projectId={projectId}
//             members={members}
//             onCreated={(newMeeting) => setMeetings((prev) => [...prev, newMeeting])}
//           />
//         )}
//       </CardHeader>
//       <CardContent className="px-6 pb-6 space-y-4">
//         {meetings.length === 0 && (
//           <p className="text-sm text-muted-foreground">No meetings yet</p>
//         )}
//         {meetings.map((m) => (
//           <div key={m.id} className="p-3 rounded-lg border space-y-2">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium">{m.title}</p>
//               {isParticipant && (
//                 <div className="flex items-center gap-1">
//                   <EditMeetingBtn meeting={m} members={members} setMeetings={setMeetings} />
//                   <DeleteMeetingBtn meeting_id={m.id} title={m.title} setMeetings={setMeetings} />
//                 </div>
//               )}
//             </div>
//             {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
//             <p className="text-xs text-muted-foreground">
//               {new Date(m.starts_at).toLocaleString()}
//               {m.ends_at && ` → ${new Date(m.ends_at).toLocaleString()}`}
//               {m.location && ` · ${m.location}`}
//             </p>

//             <MeetingAttendanceSection meetingId={m.id} members={members} isParticipant={isParticipant} />
//             <MeetingNotesSection meetingId={m.id} isParticipant={isParticipant} currentUserEmail={currentUserEmail} />
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }
// MeetingsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Video, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateMeetingBtn from "../Btns/CreateMeetingBtn/CreateMeetingBtn";

import Loading from "../CommunityComponent/Loading";
import { GetMeetingsAction } from "@/Actions/Meetings/getMeetings.action";
import MeetingDetailDialog from "./MeetingDetailDialog";

function isUpcoming(meeting: any) {
  return new Date(meeting.starts_at) >= new Date();
}

function formatMeetingDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MeetingsSection({
  projectId,
  members,
  isParticipant,
}: {
  projectId: number;
  members: any[];
  isParticipant: boolean;
}) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

  async function loadMeetings() {
    setLoading(true);
    try {
      const { ok, payload } = await GetMeetingsAction();
      if (ok) {
        setMeetings(payload.filter((m: any) => m.project === projectId));
      } else {
        toast.error("Failed to load meetings", { position: "top-center", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong loading meetings", { position: "top-center", duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, [projectId]);

  if (loading) return <Loading />;

  const upcoming = meetings.filter(isUpcoming).sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
  const past = meetings.filter((m) => !isUpcoming(m)).sort(
    (a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {upcoming.length} upcoming · {past.length} past
        </p>
        {isParticipant && (
          <CreateMeetingBtn
            projectId={projectId}
            members={members}
            onCreated={(newMeeting) => setMeetings((prev) => [...prev, newMeeting])}
          />
        )}
      </div>

      {meetings.length === 0 && (
        <p className="text-sm text-muted-foreground">No meetings scheduled yet</p>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((m) => (
              <MeetingCard key={m.id} meeting={m} isPast={false} onClick={() => setSelectedMeeting(m)} />
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Past Meetings</h3>
          <div className="space-y-2">
            {past.map((m) => (
              <MeetingCard key={m.id} meeting={m} isPast={true} onClick={() => setSelectedMeeting(m)} />
            ))}
          </div>
        </div>
      )}

      {selectedMeeting && (
        <MeetingDetailDialog
          open={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          meeting={selectedMeeting}
          members={members}
          isParticipant={isParticipant}
          setMeetings={setMeetings}
        />
      )}
    </div>
  );
}

function MeetingCard({
  meeting,
  isPast,
  onClick,
}: {
  meeting: any;
  isPast: boolean;
  onClick: () => void;
}) {
  const isOnline = !!meeting.location && /meet|teams|zoom|google/i.test(meeting.location);
  const Icon = isOnline ? Video : MapPin;
  const iconBg = isPast
    ? "bg-blue-100 dark:bg-blue-900/30"
    : isOnline
      ? "bg-blue-100 dark:bg-blue-900/30"
      : "bg-green-100 dark:bg-green-900/30";
  const iconColor = isPast ? "text-muted-foreground" : isOnline ? "text-blue-600" : "text-green-600";

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-medium text-sm truncate">{meeting.title}</p>
              {isPast && (
                <Badge variant="secondary" className="text-xs shrink-0">Past</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatMeetingDate(meeting.starts_at)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {meeting.attendees?.length ?? 0} attendees
              </span>
              {meeting.location && (
                <span className="flex items-center gap-1 truncate">
                  <Icon className="h-3 w-3" />
                  {meeting.location}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}