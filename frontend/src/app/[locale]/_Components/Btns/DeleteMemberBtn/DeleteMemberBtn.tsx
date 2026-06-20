"use client"

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Globe, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { RemoveMemberAction } from '@/Actions/Memberships/RemoveMember.action';
import { useState } from 'react';
import { Memberships } from '@/types/team';
export default function DeleteMembershipBtn({membership_id,name,setMembers}:{membership_id:number;name:string;  setMembers: React.Dispatch<React.SetStateAction<Memberships[]>>;
}) {

       const [loading, setLoading] = useState(false);
        const [open, setOpen] = useState(false);
          async function handleDeleteMember(){
            
             console.log("Calling delete for:", membership_id); // ← تأكد إن الـ id صح

             setLoading(true);
                const { payload, ok  } = await RemoveMemberAction(membership_id);
                console.log(payload);
                  console.log("Response:", { payload, ok }); // ← شوف الـ response

                
                if(ok){
                      setMembers((prev:any) =>
    prev.filter((m:any) => m.id !== membership_id)
  );
                   toast.success("Deleted Member successfully", { position: "top-center", duration: 2000 });
                     setOpen(false);
                }
                else   toast.error("faild Deleted", { position: "top-center", duration: 2000 });
              setLoading(false)
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge variant="outline" className=" text-destructive hover:text-destructive cursor-pointer">
        <Trash2 className="size-3.5"/>
         Remove
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


 <p className="text-sm text-muted-foreground">
    Remove  {name}  from the team? They will lose access to this project.
 </p>
                    <DialogFooter className="mt-3">
          <Button variant="outline"  type="button">
            Cancel
          </Button>
          <Button className='py-0 h-8 dark:bg-destructive/60  bg-destructive text-white'  onClick={handleDeleteMember}>
            {loading ? "Sending..." : "Delete"}
          </Button>
        </DialogFooter>
              




      </div>
      </DialogContent>
    </Dialog>
  )
}
