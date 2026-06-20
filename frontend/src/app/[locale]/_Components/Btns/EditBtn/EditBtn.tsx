// import { EditProjectAction } from '@/Actions/Project/editProject.action';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Textarea } from '@/components/ui/textarea';
// import { editProjectSchema } from '@/schemas/EditProject.schema';
// import { editProjectValues } from '@/types/schema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Globe, Pen } from 'lucide-react';
// import React from 'react'
// import { Form, useForm } from 'react-hook-form';

// export default function EditBtn({id}:{id:number}) {
//       const formObj = useForm<editProjectValues>({
//      resolver: zodResolver(editProjectSchema),
//      defaultValues: {
//     "name": "",
// 	"description": "",
// 	"min_members": 3,
// 	"max_members": 6,
// 	"is_public": false,
// 	"repository_url": "",
// 	"archive_tags": []
//      },
//    });
//      const { control,watch, handleSubmit, formState: { isSubmitting, isValid }, } = formObj;
//        async function handleCreateTeam(data:editProjectValues) {
//          const postData:editProjectValues = {
//            ...data,
           
//          };
//        console.log( postData); 
//     const { payload, ok  } = await EditProjectAction(id,);
//          if(ok){
// //  router.push(`/${role}/projects`)
//          }
//            console.log(payload); 
//         }
//   return (
//       <Dialog>
//       <DialogTrigger asChild>
//         <Button  variant={'outline'}>
//         <Pen className="size-3.5"/>
//          Edit
//     </Button>
//       </DialogTrigger>
//       <DialogContent
//         className="  max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4"
//       >
//         <DialogHeader>
//           <DialogTitle className="">
//             <div className="text-lg leading-none font-semibold flex items-center gap-2 ">
//                 Create New Project
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//       <div className="w-full">
//        <Form {...formObj}>
//                 <form onSubmit={handleSubmit(handleCreateTeam)} className="">

// <div className="space-y-6">

//                <FormField
//                 control={control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem className="">
//                     <FormLabel className="text-foreground text-sm font-medium">
//                      Team Name *
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="text"
//                       placeholder="e.g. Code Crusaders"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//                    <FormField
//                         control={control}
//                         name="description"
//                         render={({ field }) => (
//                           <FormItem className="my-2 w-full">
//                             <div className="gap-2">
//                               <FormLabel>Description *</FormLabel>
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
//                              <FormField
//                 control={control}
//                 name="repository_url"
//                 render={({ field }) => (
//                   <FormItem className="">
//                     <FormLabel className="text-foreground text-sm font-medium">
//                     Repository Url *
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="text"
//                       placeholder="e.g. https://github.com/team/smart-attendance"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//      <FormField
//             control={control}
//             name="is_public"
//             render={({ field }) => (
//               <FormItem className="flex items-center justify-between">
//                 <div className="flex flex-col ">
//                   <FormLabel><Globe className="size-4 text-primary"/>Public Project</FormLabel>
//                   <p className="text-xs text-muted-foreground">
//                    Visible in Browse Projects. Students can send join requests.
//                   </p>
//                 </div>
//                 <FormControl>
//                   <Switch
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//               </div>
                   
//                 </form>
//                 </Form>

//       {/* </div> */}
//     {/* {role=="student" && */}
//     {/* } */}


//       </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client";
import { EditProjectAction } from '@/Actions/Project/editProject.action';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { editProjectSchema } from '@/schemas/EditProject.schema';
import { editProjectValues } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Pen } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MultiSelect from '../../Auth/Forms/TagsSearch/MultiSelect';

export default function EditBtn({ id, onEdited,project }: { id: number; onEdited?: (payload: any) => void ;project:any}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<editProjectValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
         name: project.name,
      description: project.description,
      min_members: project.min_members,
      max_members: project.max_members,
      is_public: project.is_public,
      repository_url: project.repository_url ?? "",
      archive_tags: project.archive_tags ?? [],
    },
  });

  const { control, handleSubmit,watch } = formObj;

  async function handleEdit(data: editProjectValues) {
        const DataEdit:editProjectValues = {
          ...data,
        
        archive_tags: data.archive_tags ?? [],
        };
      console.log( DataEdit); 
      console.log("data being sent:", data);
        console.log("archive_tags:", data.archive_tags);
    setLoading(true);
    const { payload, ok } = await EditProjectAction(id, data);
    setLoading(false);

    if (ok) {
      toast.success("Project updated successfully", { position: "top-center" });
      onEdited?.(payload);
      setOpen(false);
    } else {
      // const message = payload?.detail ?? Object.values(payload || {})?.[0] ?? "Something went wrong";
      toast.error("failed edited", { position: "top-center" });
    }
  }
      const minMembers = watch("min_members");
const maxMembers = watch("max_members");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pen className="size-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Code Crusaders" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" placeholder="What is your project about?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="repository_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. https://github.com/team/project" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel><Globe className="size-4 text-primary inline mr-1" />Public Project</FormLabel>
                    <p className="text-xs text-muted-foreground">Visible in Browse Projects.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
<FormField
  control={control}
  name="archive_tags"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-foreground text-sm font-medium">
        Skills * (Select at least 3)</FormLabel>
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
<div className="grid grid-cols-2 gap-6">
<FormField
  control={control}
  name="min_members"
  render={({ field }) => {
    const value = field.value ?? 5;

    return (
      <FormItem className="gap-0">
        <FormLabel className="text-xs text-muted-foreground mb-2">
          Minimum Members
        </FormLabel>

        <FormControl>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
       disabled={value <= 5}  
onClick={() => field.onChange(value - 1)}
            >
              -
            </Button>

            <span className="w-6 text-center font-semibold text-foreground">
              {value}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={value >= maxMembers}
              onClick={() => field.onChange(value + 1)}
            >
              +
            </Button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
<FormField
  control={control}
  name="max_members"
  render={({ field }) => {
    const value = field.value ;

    return (
      <FormItem className="gap-0">
        <FormLabel className="text-xs text-muted-foreground mb-2">
          Maximum Members
        </FormLabel>

        <FormControl>
          <div className="flex items-center gap-3">
        <Button
  type="button"
  variant="outline"
  size="icon"
disabled={field.value <= minMembers}  
onClick={() => field.onChange((field.value ?? minMembers) - 1)}
>
  -
</Button>

            <span className="w-6 text-center font-semibold text-foreground">
              {value}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={value >= 7}
              onClick={() => field.onChange(value + 1)}
            >
              +
            </Button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}