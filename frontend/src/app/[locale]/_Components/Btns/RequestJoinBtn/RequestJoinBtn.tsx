// "use client"
// import { CreateInvitationAction } from '@/Actions/invitations/createInvitation.action';
// import { EditProjectAction } from '@/Actions/Project/editProject.action';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Textarea } from '@/components/ui/textarea';
// import { RequestJoinSchema } from '@/schemas/requestJoin.schema';
// import {   requestJoin } from '@/types/schema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Globe, Mail, Pen } from 'lucide-react';
// import React, { useEffect, useState } from 'react'
// import {  useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { useSession } from "next-auth/react";


// import { CreateJoinRequestAction } from '@/Actions/joinRequests/createJoinRequest.action';
// export default function RequestJoinBtn({projectId,onRequest,leaderEmail,existingRequests}:{projectId:number;leaderEmail:string;  onRequest: (requestsJoin: any) => void;   existingRequests: any[];}) {
//   const { data: session } = useSession();

// // console.log(session?.user?.email);
// // const currentUserEmail=session?.user?.email
// //     if (currentUserEmail === leaderEmail) return null;
// // console.log(session?.user?.email);
//       const formObj = useForm<requestJoin>({
//      resolver: zodResolver(RequestJoinSchema),
//      defaultValues: {
// 	message: "",
// project:projectId
//      },
//    });


//      const { control, handleSubmit, formState: { isSubmitting, isValid }, } = formObj;

//        const [loading, setLoading] = useState(false);
// const hasRequest = existingRequests?.some(
//   (r) => r.user_detail?.email === session?.user?.email // ✅ الحقل الصحيح
// );
//   if (hasRequest) return null;

//   if (session?.user?.email === leaderEmail) return null;
//        async function handleInvite(data:requestJoin) {
//            const dataMember:requestJoin = {
//            ...data,
//            project:projectId
           
//          };
//        console.log( dataMember); 
//        setLoading(true)
//     const { payload, ok  } = await CreateJoinRequestAction(dataMember);

//     // if (!inviteeId) {
//     //   toast.error("Please enter a user ID");

//     //   return;
//     // }
//     setLoading(false);
//   console.log("Response:", { payload, ok });

//     if (ok) {
      
//       toast.success("Requesting sent");
//       onRequest(payload);
//     } else {
//      const firstValue = Object.values(payload || {})?.[0];

// const message =
//   (typeof payload === "object" && payload && "detail" in payload)
//     ? (payload as any).detail
//     : Array.isArray(firstValue)
//       ? firstValue[0]
//       : typeof firstValue === "string"
//         ? firstValue
//         : "Error occurred";
//   toast.error(message);
//           console.log("Error payload:", payload); // ✅

//       // const firstError = typeof payload === "object" ? Object.values(payload)[0] : null;
//       // toast.error(Array.isArray(firstError) ? firstError[0] : "Failed to send invitation");
//     }
//   }


//   return (
//       <Dialog>
//       <DialogTrigger asChild>
//         <Button className="flex-1 w-full">
//         <Mail className="size-3.5"/>
//          Request to Join
//     </Button>
//       </DialogTrigger>
//       <DialogContent
//         className="  max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4"
//       >
//         <DialogHeader>
//           <DialogTitle className="flex gap-3 items-center">
//             <Mail className='size-5'/>
//             <div className="text-lg leading-none font-semibold flex items-center gap-2 ">
//                Request to Join
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//       <div className="w-full">
//        <Form {...formObj}>
//                 <form onSubmit={handleSubmit(handleInvite)} className="">

// <div className="space-y-6">

             
//                    <FormField
//                         control={control}
//                         name="message"
//                         render={({ field }) => (
//                           <FormItem className="my-2 w-full">
//                             <div className="gap-2">
//                               <FormLabel>Message *</FormLabel>
//                             </div>
//                             <FormControl>
//                               <Textarea
//                                 {...field}
//                                 className="resize-none "
//                                 placeholder="What is your project about?"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
 
//               </div>
//                     <DialogFooter className="mt-3">
//           <Button variant="outline">
//             Cancel
//           </Button>
//           <Button type="submit">
//             {loading ? "Sending..." : "Send request"}
//           </Button>
//         </DialogFooter>
//                 </form>
//                 </Form>




//       </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RequestJoinSchema } from "@/schemas/requestJoin.schema";
import { requestJoin } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CreateJoinRequestAction } from "@/Actions/joinRequests/createJoinRequest.action";

export default function RequestJoinBtn({
  projectId,
  onRequest,
  leaderEmail,
  existingRequests,
}: {
  projectId: number;
  leaderEmail: string;
  onRequest: (requestsJoin: any) => void;
  existingRequests: any[];
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const formObj = useForm<requestJoin>({
    resolver: zodResolver(RequestJoinSchema),
    defaultValues: {
      message: "",
      project: projectId,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  const hasRequest = existingRequests?.some(
    (r) => r.user_detail?.email === session?.user?.email && r.project === projectId
  );

  if (hasRequest) return null;
  if (session?.user?.email === leaderEmail) return null;

  async function onSubmit(data: requestJoin) {
    const { payload, ok } = await CreateJoinRequestAction({
      ...data,
      project: projectId,
    });

    if (ok) {
      toast.success("Request sent", { position: "top-center", duration: 2000 });
      onRequest(payload);
      reset({ message: "", project: projectId });
      setOpen(false);
    } else {
      const firstValue = Object.values(payload || {})?.[0];
      const message =
        typeof payload === "object" && payload && "detail" in payload
          ? (payload as any).detail
          : Array.isArray(firstValue) ? firstValue[0] : "Error occurred";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 w-full">
          <Mail className="size-3.5" />
          Request to Join
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle className="flex gap-3 items-center">
            <Mail className="size-5" />
            <div className="text-lg leading-none font-semibold flex items-center gap-2">
              Request to Join
            </div>
          </DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem className="my-2 w-full">
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      placeholder="What is your project about?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}