"use client"
import { CreateInvitationAction } from '@/Actions/invitations/createInvitation.action';
import { EditProjectAction } from '@/Actions/Project/editProject.action';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { inviteMemberSchema } from '@/schemas/InviteMember.schema';
import {  inviteMember } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Mail, Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {  useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAllStudentsAction } from '@/Actions/Memberships/getAllStudents.action';
import { useSession } from "next-auth/react";
type Student = {
  id: number;
  username: string;
  full_name: string;
  email: string;
role :string;
};
export default function InviteTeamBtn({projectId,onInvited, className}:{projectId:number;  className?: string;  onInvited: (invitation: any) => void;}) {

const { data: session } = useSession();

// console.log(session?.user?.email);
const currentUserEmail=session?.user?.email
    const [students, setStudents] = useState<Student[]>([]);

      const formObj = useForm<inviteMember>({
     resolver: zodResolver(inviteMemberSchema),
     defaultValues: {
	message: "",
invitee:undefined,
project:projectId
     },
   });
  async function loadStudents() {
    const { payload, ok } = await GetAllStudentsAction();

    if (ok) {
      const filteredStudents = payload.filter(
        (student: Student) =>
          student.email !== currentUserEmail
      );

      setStudents(filteredStudents);
    }
  }
useEffect(() => {
  if (!currentUserEmail) return;


  loadStudents();
}, [currentUserEmail]);
     const { control, handleSubmit, formState: { isSubmitting, isValid }, } = formObj;

       const [loading, setLoading] = useState(false);
       async function handleInvite(data:inviteMember) {
           const dataMember:inviteMember = {
           ...data,
           project:projectId
           
         };
       console.log( dataMember); 
       setLoading(true)
    const { payload, ok  } = await CreateInvitationAction(dataMember);
    setLoading(false);
  console.log("Response:", { payload, ok });

    if (ok) {
      
      toast.success("Invitation sent");
      onInvited(payload);
    } else {
     const firstValue = Object.values(payload || {})?.[0];

const message =
  (typeof payload === "object" && payload && "detail" in payload)
    ? (payload as any).detail
    : Array.isArray(firstValue)
      ? firstValue[0]
      : typeof firstValue === "string"
        ? firstValue
        : "Error occurred";
  toast.error(message);
          console.log("Error payload:", payload); 
    }
  }


  return (
      <Dialog>
      <DialogTrigger asChild className="">
        <Button className={className}>
        <Pen className="size-3.5"/>
         Invite Member
    </Button>
      </DialogTrigger>
      <DialogContent
        className="  max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-3 items-center">
            <Mail className='size-5'/>
            <div className="text-lg leading-none font-semibold flex items-center gap-2 ">
               Invite Team Member
            </div>
          </DialogTitle>
        </DialogHeader>

      <div className="w-full">
       <Form {...formObj}>
                <form onSubmit={handleSubmit(handleInvite)} className="">

<div className="space-y-6">

             
                   <FormField
                        control={control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="my-2 w-full">
                            <div className="gap-2">
                              <FormLabel>Message *</FormLabel>
                            </div>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="resize-none "
                                placeholder="What is your project about?"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
 <FormField
                control={control}
                name="invitee"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Member *
                    </FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                    value={field.value ? field.value.toString() : ""}
                       onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger
                          id="Member"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          
                          {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.email}
                  </SelectItem>
                ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           <FormField
  control={control}
  name="project"
  render={({ field }) => (
    <FormItem className="hidden">
      <FormControl>
        <Input type="hidden" {...field} />
      </FormControl>
    </FormItem>
  )}
/>
              </div>
                    <DialogFooter className="mt-3">
          <Button variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
                </form>
                </Form>




      </div>
      </DialogContent>
    </Dialog>
  )
}
