// // ChecklistsSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { toast } from "sonner";
// import { GetChecklistsAction } from "@/Actions/Tasks/checklists/getAllChecklists.action";
// import CreateChecklistBtn from "../Btns/CreateChecklistBtn/CreateChecklistBtn";
// import DeleteChecklistBtn from "../Btns/DeleteChecklistBtn/DeleteChecklistBtn";
// import ChecklistItemRow from "./ChecklistItemRow";
// import CreateChecklistItemBtn from "../Btns/CreateChecklistItemBtn/CreateChecklistItemBtn";

// export default function ChecklistsSection({
//   taskId,
//   isParticipant,
// }: {
//   taskId: number;
//   isParticipant: boolean;
// }) {
//   const [checklists, setChecklists] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadChecklists() {
//     setLoading(true);
//     const { ok, payload } = await GetChecklistsAction();
//     if (ok) {
//       setChecklists(payload.filter((c: any) => c.task === taskId));
//     } else {
//       toast.error("Failed to load checklists", { position: "top-center", duration: 2000 });
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadChecklists();
//   }, [taskId]);

//   if (loading) return <p className="text-sm text-muted-foreground">Loading checklists...</p>;

//   return (
//     <Card className="p-0 mb-5">
//       <CardHeader className="p-6 pb-3 flex items-center justify-between">
//         <h4 className="text-sm">Checklists ({checklists.length})</h4>
//         {isParticipant && (
//           <CreateChecklistBtn
//             taskId={taskId}
//             position={checklists.length + 1}
//             onCreated={(newChecklist) => setChecklists((prev) => [...prev, { ...newChecklist, items: [] }])}
//           />
//         )}
//       </CardHeader>
//       <CardContent className="px-6 pb-6 space-y-4">
//         {checklists.length === 0 && (
//           <p className="text-sm text-muted-foreground">No checklists yet</p>
//         )}
//         {checklists.map((checklist) => (
//           <ChecklistGroup
//             key={checklist.id}
//             checklist={checklist}
//             isParticipant={isParticipant}
//             setChecklists={setChecklists}
//           />
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

// function ChecklistGroup({
//   checklist,
//   isParticipant,
//   setChecklists,
// }: {
//   checklist: any;
//   isParticipant: boolean;
//   setChecklists: (checklists: any) => void;
// }) {
//   const [items, setItems] = useState<any[]>(checklist.items ?? []);
//   const completedCount = items.filter((i) => i.is_completed).length;

//   function updateItemsInParent(updatedItems: any[]) {
//     setItems(updatedItems);
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium">{checklist.title}</p>
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-muted-foreground">{completedCount}/{items.length}</span>
//           {isParticipant && (
//             <DeleteChecklistBtn
//               checklist_id={checklist.id}
//               setChecklists={setChecklists}
//             />
//           )}
//         </div>
//       </div>

//       {/* Progress */}
//       <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
//         <div
//           className="h-full bg-primary rounded-full transition-all"
//           style={{ width: items.length > 0 ? `${(completedCount / items.length) * 100}%` : "0%" }}
//         />
//       </div>

//       {/* Items */}
//       <div className="space-y-1.5 pl-2">
//         {items.map((item) => (
//           <ChecklistItemRow key={item.id} item={item} setItems={updateItemsInParent} />
//         ))}
//       </div>

//       {isParticipant && (
//         <CreateChecklistItemBtn
//           checklistId={checklist.id}
//           position={items.length + 1}
//           onCreated={(newItem) => setItems((prev) => [...prev, newItem])}
//         />
//       )}
//     </div>
//   );
// }
// ChecklistsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CreateChecklistBtn from "../Btns/ChecklistBtn/CreateChecklistBtn/CreateChecklistBtn";
import DeleteChecklistBtn from "../Btns/ChecklistBtn/DeleteChecklistBtn/DeleteChecklistBtn";
import CreateChecklistItemBtn from "../Btns/ChecklistBtn/CreateChecklistItemBtn/CreateChecklistItemBtn";
import ChecklistItemRow from "./ChecklistItemRow";
import { GetChecklistsAction } from "@/Actions/Tasks/checklists/getAllChecklists.action";

export default function ChecklistsSection({
  taskId,
  isParticipant,
}: {
  taskId: number;
  isParticipant: boolean;
}) {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChecklists() {
    setLoading(true);
    const { ok, payload } = await GetChecklistsAction();
    if (ok) setChecklists(payload.filter((c: any) => c.task === taskId));
    setLoading(false);
  }

  useEffect(() => {
    loadChecklists();
  }, [taskId]);

  function updateChecklistItems(checklistId: number, newItems: any[]) {
    setChecklists((prev) => prev.map((c) => (c.id === checklistId ? { ...c, items: newItems } : c)));
  }

  if (loading) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Checklists ({checklists.length})</p>
        {isParticipant && (
          <CreateChecklistBtn
            taskId={taskId}
            position={checklists.length + 1}
            onCreated={(newChecklist) => setChecklists((prev) => [...prev, { ...newChecklist, items: [] }])}
          />
        )}
      </div>

      {checklists.map((checklist) => {
        const items = checklist.items ?? [];
        const completedCount = items.filter((i: any) => i.is_completed).length;

        return (
          <div key={checklist.id} className="space-y-2 pl-2 border-l-2 border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">{checklist.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{completedCount}/{items.length}</span>
                {isParticipant && (
                  <DeleteChecklistBtn checklist_id={checklist.id} setChecklists={setChecklists} />
                )}
              </div>
            </div>

            <div className="space-y-1">
              {items.map((item: any) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  setItems={(newItems: any) => updateChecklistItems(checklist.id, newItems(items))}
                />
              ))}
            </div>

            {isParticipant && (
              <CreateChecklistItemBtn
                checklistId={checklist.id}
                position={items.length + 1}
                onCreated={(newItem) => updateChecklistItems(checklist.id, [...items, newItem])}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}