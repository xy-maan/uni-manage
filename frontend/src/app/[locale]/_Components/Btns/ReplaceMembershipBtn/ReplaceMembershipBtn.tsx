"use client"
import { CreateInvitationAction } from '@/Actions/invitations/createInvitation.action';
import { EditProjectAction } from '@/Actions/Project/editProject.action';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {   replaceMembership } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Mail, Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {  useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CreateJoinRequestAction } from '@/Actions/joinRequests/createJoinRequest.action';
import { Badge } from '@/components/ui/badge';
import { ReplaceMembershipSchema } from '@/schemas/requestJoin.schema';
export default function ReplaceMembershipBtn({membershipId,membershipRole,project,name,setMembers}:{membershipId:number;membershipRole:string,project:number,name:string;setMembers:(members: any) => void;}) {
  const formObj = useForm<replaceMembership>({
     resolver: zodResolver(ReplaceMembershipSchema),
     defaultValues: {
    role: membershipRole,
project:project,
user:membershipId,

     },
   });


     const { control, handleSubmit, formState: { isSubmitting, isValid }, } = formObj;
 const [open, setOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       async function handleInvite(data:replaceMembership) {
           const dataMember:replaceMembership = {
         role: membershipRole,
project:project,
user:membershipId,
           
         };
       console.log( dataMember); 
       setLoading(true)
    const { payload, ok  } = await CreateJoinRequestAction(dataMember);

    setLoading(false);
  console.log("Response:", { payload, ok });

    if (ok) {
        setMembers((prev:any) => ({
  ...prev,
  memberships: prev.memberships.map((m:any) =>
    m.id === membershipId
      ? { ...m, role: "newRole" }
      : m
  ),
}));
toast.success("Requesting sent");
setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge className="cursor-pointer">
        <Mail className="size-3.5"/>
         Replace
    </Badge>
      </DialogTrigger>
      <DialogContent
        className="  max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4"
      >
        <DialogHeader>
          <DialogTitle >
               Replace Membership
          </DialogTitle>
        </DialogHeader>

      <div className="w-full">
       <Form {...formObj}>
                <form onSubmit={handleSubmit(handleInvite)} className="">

<div className="space-y-6">

             
                   <FormField
                        control={control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="my-2 w-full hidden">
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
   name="project"
   render={({ field }) => (
     <FormItem className="hidden">
       <FormControl>
         <Input type="hidden" {...field} />
       </FormControl>
     </FormItem>
   )}
 />
            <FormField
   control={control}
   name="user"
   render={({ field }) => (
     <FormItem className="hidden">
       <FormControl>
         <Input type="hidden" {...field} />
       </FormControl>
     </FormItem>
   )}
 />
 <p className="text-sm text-muted-foreground">
    Replace {name}  from the team?.
 </p>
              </div>
                    <DialogFooter className="mt-3">
          <Button variant="outline">
            Cancel
          </Button>
          <Button className='py-0 h-8' type="submit">
            {loading ? "Sending..." : "Replace Membership"}
          </Button>
        </DialogFooter>
                </form>
                </Form>




      </div>
      </DialogContent>
    </Dialog>
  )
}
