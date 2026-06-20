// // Btns/DeleteChecklistBtn/DeleteChecklistBtn.tsx
// "use client";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Trash2 } from "lucide-react";
// import { DeleteChecklistAction } from "@/Actions/Tasks/checklists/deleteChecklist.action";

// export default function DeleteChecklistBtn({
//   checklist_id,
//   setChecklists,
// }: {
//   checklist_id: number;
//   setChecklists: (checklists: any) => void;
// }) {
//   const [loading, setLoading] = useState(false);

//   async function handleDelete() {
//     setLoading(true);
//     const { ok } = await DeleteChecklistAction(checklist_id);
//     setLoading(false);

//     if (ok) {
//       setChecklists((prev: any) => prev.filter((c: any) => c.id !== checklist_id));
//       toast.success("Checklist deleted successfully", { position: "top-center", duration: 2000 });
//     } else {
//       toast.error("faild deleted", { position: "top-center", duration: 2000 });
//     }
//   }

//   return (
//     <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
//       <Trash2 className="size-3.5" />
//     </button>
//   );
// }
// Btns/DeleteChecklistBtn/DeleteChecklistBtn.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DeleteChecklistAction } from "@/Actions/Tasks/checklists/deleteChecklist.action";

export default function DeleteChecklistBtn({
  checklist_id,
  setChecklists,
}: {
  checklist_id: number;
  setChecklists: (checklists: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteChecklistAction(checklist_id);
    setLoading(false);

    if (ok) {
      setChecklists((prev: any) => prev.filter((c: any) => c.id !== checklist_id));
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
      <Trash2 className="size-3.5" />
    </button>
  );
}