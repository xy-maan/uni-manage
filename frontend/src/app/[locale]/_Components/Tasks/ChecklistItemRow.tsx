
"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ToggleChecklistItemAction } from "@/Actions/Tasks/checklistItems/toggleChecklistItem.action";
import { DeleteChecklistItemAction } from "@/Actions/Tasks/checklistItems/deleteChecklistItem.action";


export default function ChecklistItemRow({
  item,
  setItems,
}: {
  item: any;
  setItems: (updater: (items: any[]) => any[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const { payload, ok } = await ToggleChecklistItemAction(item.id, { is_completed: !item.is_completed });
    setLoading(false);

    if (ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? payload : i)));
    } else {
      toast.error("faild update item", { position: "top-center", duration: 2000 });
    }
  }

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteChecklistItemAction(item.id);
    setLoading(false);

    if (ok) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={item.is_completed} onCheckedChange={handleToggle} disabled={loading} />
      <span className={`flex-1 text-sm ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
        {item.content}
      </span>
      <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}