// Btns/EditSupervisorBtn/EditSupervisorBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateSupervisorAction } from "@/Actions/supervisor/updateSupervisor.action";

const schema = z.object({
  role: z.enum(["primary", "secondary"]),
});
type FormValues = z.infer<typeof schema>;

export default function EditSupervisorBtn({
  supervisor_id,
  currentRole,
  setSupervisors,
}: {
  supervisor_id: number;
  currentRole: string;
  setSupervisors: (supervisors: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: currentRole as "primary" | "secondary" },
  });

  const { control, handleSubmit } = formObj;

  async function handleSave(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await UpdateSupervisorAction(supervisor_id, data);
    setLoading(false);

    if (ok) {
      setSupervisors((prev: any) => prev.map((s: any) => (s.id === supervisor_id ? payload : s)));
      toast.success("Supervisor role updated", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7">
          <Pen className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Supervisor Role</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleSave)}>
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}