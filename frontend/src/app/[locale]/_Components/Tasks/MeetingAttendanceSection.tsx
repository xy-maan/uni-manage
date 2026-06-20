// // MeetingAttendanceSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// // import { GetAttendanceRecordsAction } from "@/Actions/MeetingAttendance/GetAttendanceRecords.action";
// // import { CreateAttendanceRecordAction } from "@/Actions/MeetingAttendance/CreateAttendanceRecord.action";
// // import { UpdateAttendanceRecordAction } from "@/Actions/MeetingAttendance/UpdateAttendanceRecord.action";
// // import { DeleteAttendanceRecordAction } from "@/Actions/MeetingAttendance/DeleteAttendanceRecord.action";
// import { X } from "lucide-react";

// export default function MeetingAttendanceSection({
//   meetingId,
//   members,
//   isParticipant,
// }: {
//   meetingId: number;
//   members: any[];
//   isParticipant: boolean;
// }) {
//   const [records, setRecords] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadRecords() {
//     setLoading(true);
//     const { ok, payload } = await GetAttendanceRecordsAction();
//     if (ok) {
//       setRecords(payload.filter((r: any) => r.meeting === meetingId));
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadRecords();
//   }, [meetingId]);

//   async function handleStatusChange(record: any, status: string) {
//     if (record.id) {
//       const { payload, ok } = await UpdateAttendanceRecordAction(record.id, { status });
//       if (ok) {
//         setRecords((prev) => prev.map((r) => (r.id === record.id ? payload : r)));
//       } else {
//         toast.error("faild update attendance", { position: "top-center", duration: 2000 });
//       }
//     } else {
//       const { payload, ok } = await CreateAttendanceRecordAction({
//         meeting: meetingId,
//         user: record.user,
//         status: status as any,
//       });
//       if (ok) {
//         setRecords((prev) => [...prev, payload]);
//       } else {
//         toast.error("faild create attendance record", { position: "top-center", duration: 2000 });
//       }
//     }
//   }

//   async function handleRemove(recordId: number) {
//     const { ok } = await DeleteAttendanceRecordAction(recordId);
//     if (ok) {
//       setRecords((prev) => prev.filter((r) => r.id !== recordId));
//     } else {
//       toast.error("faild remove record", { position: "top-center", duration: 2000 });
//     }
//   }

//   if (loading) return null;

//   return (
//     <div className="space-y-1.5">
//       <p className="text-xs font-medium text-muted-foreground">Attendance</p>
//       {members.map((m: any) => {
//         const record = records.find((r) => r.user === m.user) ?? { user: m.user };
//         return (
//           <div key={m.user} className="flex items-center gap-2">
//             <span className="text-xs flex-1">{m.user_detail?.full_name}</span>
//             {isParticipant ? (
//               <Select value={record.status ?? ""} onValueChange={(v) => handleStatusChange(record, v)}>
//                 <SelectTrigger className="h-7 w-28 text-xs">
//                   <SelectValue placeholder="Set status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="invited">Invited</SelectItem>
//                   <SelectItem value="present">Present</SelectItem>
//                   <SelectItem value="absent">Absent</SelectItem>
//                   <SelectItem value="excused">Excused</SelectItem>
//                 </SelectContent>
//               </Select>
//             ) : (
//               <span className="text-xs text-muted-foreground capitalize">{record.status ?? "—"}</span>
//             )}
//             {record.id && isParticipant && (
//               <button onClick={() => handleRemove(record.id)} className="text-muted-foreground hover:text-destructive">
//                 <X className="size-3" />
//               </button>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
// MeetingAttendanceSection.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CreateAttendanceRecordAction } from "@/Actions/Meetings/CreateAttendanceRecord.action";
import { UpdateAttendanceRecordAction } from "@/Actions/Meetings/UpdateAttendanceRecord.action";
import { GetAttendanceRecordsAction } from "@/Actions/Meetings/GetAttendanceRecords.action";


export default function MeetingAttendanceSection({
  meetingId,
  members,
  isParticipant,
}: {
  meetingId: number;
  members: any[];
  isParticipant: boolean;
}) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    setLoading(true);
    const { ok, payload } = await GetAttendanceRecordsAction();
    if (ok) setRecords(payload.filter((r: any) => r.meeting === meetingId));
    setLoading(false);
  }

  useEffect(() => {
    loadRecords();
  }, [meetingId]);

  async function handleStatusChange(userId: number, existingRecord: any, status: string) {
    if (existingRecord) {
      const { payload, ok } = await UpdateAttendanceRecordAction(existingRecord.id, { status });
      if (ok) setRecords((prev) => prev.map((r) => (r.id === existingRecord.id ? payload : r)));
      else toast.error("faild update attendance", { position: "top-center", duration: 2000 });
    } else {
      const { payload, ok } = await CreateAttendanceRecordAction({ meeting: meetingId, user: userId, status: status as any });
      if (ok) setRecords((prev) => [...prev, payload]);
      else toast.error("faild create attendance record", { position: "top-center", duration: 2000 });
    }
  }

  if (loading) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Attendance</p>
      {members.map((m: any) => {
        const record = records.find((r) => r.user === m.user);
        return (
          <div key={m.user} className="flex items-center gap-2">
            <span className="text-xs flex-1">{m.user_detail?.full_name}</span>
            {isParticipant ? (
              <Select value={record?.status ?? ""} onValueChange={(v) => handleStatusChange(m.user, record, v)}>
                <SelectTrigger className="h-7 w-28 text-xs">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-muted-foreground capitalize">{record?.status ?? "—"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}