// // Btns/RequestSupervisorBtn/RequestSupervisorBtn.tsx
// "use client";
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GetAllStudentsAction } from "@/Actions/Memberships/getAllStudents.action";
import { SendSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/SendSupervisorRequest.action";
import { RequestType } from "@/types/schema";
import { requestSchema } from "@/schemas/requestSupervisor.schema";
import MultiSelect from "../../Auth/Forms/TagsSearch/MultiSelect";
import { GetAllSupervisorAction } from "@/Actions/supervisor/getAllSupervisor.action";
import { SupervisorRequest } from "@/types/supervisor";

type Doctor = { id: number; full_name: string; username: string; email: string };



export default function RequestSupervisorBtn({
  projectId,
  role,
  onRequested,
}: {
  projectId: number;
  role: "primary" | "secondary";
  onRequested: (request: SupervisorRequest) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<Doctor[]>([]);

  const formObj = useForm<RequestType>({
  resolver: zodResolver(requestSchema),
  defaultValues: {
    project: projectId,
    role: role,
    supervisor: undefined,
    message: "",
    proposal: "",
    expected_scope: "",
    technology_names: undefined,
  },
});

  const { control, handleSubmit, reset } = formObj;

  async function loadSupervisors() {
    const { ok, payload } = await GetAllSupervisorAction();
    
    if (ok) {
      setSupervisors(
        payload.filter((u: Doctor & { role: string }) => u.role === "SUPERVISOR")
      );
    }
  }

  useEffect(() => {
    if (!open) return;
    loadSupervisors();
  }, [open]);
(formObj.getValues());
  async function handleSend(data: RequestType) {
    (data)
    setLoading(true);
    const body: RequestType = {
      project: projectId,
      supervisor: data.supervisor,
      role: role, 
      message: data.message,
    };

  if (role === "primary") { 
    body.proposal = data.proposal;
    body.abstract = data.abstract;
    body.expected_scope = data.expected_scope;
    body.technology_names = data.technology_names;
  }
    const { payload, ok } = await SendSupervisorRequestAction(body);
    setLoading(false);

    if (ok) {
      onRequested(payload);
      toast.success("Supervisor request sent successfully", {
        position: "top-center",
        duration: 2000,
      });
      reset();
      setOpen(false);
    } else {
      const firstValue = Object.values(payload || {})?.[0];
      const message =
        typeof payload === "object" && payload && "detail" in payload
          ? (payload as { detail: string }).detail
          : Array.isArray(firstValue)
            ? firstValue[0]
            : "Error occurred";
      toast.error(String(message));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <GraduationCap className="size-4" />
          Request {role === "primary" ? "Doctor" : "TA"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>
            Request {role === "primary" ? "Primary Doctor" : "Secondary TA"}
          </DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
        <form onSubmit={handleSubmit(handleSend)}>
            <div className="space-y-4">

              {/* Supervisor Select */}
              <FormField
                control={control}
                name="supervisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisors.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.full_name} (@{s.username})
                            </SelectItem>
                          ))}
               
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary only fields */}
              {role === "primary" && (
                <>
                  <FormField
                    control={control}
                    name="proposal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposal </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" rows={3} placeholder="Full project proposal text..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
                  <FormField
                    control={control}
                    name="expected_scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Scope </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" rows={2} placeholder="Authentication, dashboard, reports..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
  control={control}
  name="technology_names"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-foreground text-sm font-medium">
        Your Skills</FormLabel>
      <FormControl>
        <MultiSelect
          variant="student"
          value={field.value ?? []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                </>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}