// import { CircleAlert, CircleCheck, Clock, FileText, FolderKanban, Users } from 'lucide-react'
// import React from 'react'

// export default function CardsInfoDashboard({variant}:{variant:string}) {
//   return (
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8  ">
//             <div className="card bg-card text-card-foreground rounded-xl border">
//               <div className="item-card p-6 flex items-center justify-between">
//                 <div className="flex flex-col">
//                   <h5 className={`${variant=="projects"?"text-muted-foreground font-normal":" text-foreground/80 mb-1 font-medium"} text-sm `}>
//                   {variant=="student"&&" Tasks Completed"}
//                   {variant=="supervisor"&&"Supervised Projects"}
//                   {variant=="projects"&&"Total Projects"}
                   
//                   </h5>
//                   <p className=" text-2xl md:text-xl mt-1 font-semibold mb-2">12/18</p>
//                 </div>
//                 <div className={`rounded-xl p-3  ${variant=="student"?"text-success bg-success/10":"text-primary bg-primary/10" } `}>
//                   {variant=="student"&&  <CircleCheck  className="size-6" />}
//                   {variant=="supervisor"&&  <FolderKanban className="size-6" />}
//                   {variant=="projects"&&  <FolderKanban className="size-5" />}
              
                
//                 </div>
//               </div>
//             </div>
//             <div className="card bg-card text-card-foreground rounded-xl border">
//               <div className="item-card p-6 flex items-center justify-between">
//                 <div className="flex flex-col">
//                       <h5 className={`${variant=="projects"?"text-muted-foreground font-normal":" text-foreground/80 mb-1 font-medium"} text-sm `}>
//                     {variant=="student"&&"Pending Tasks"}
//                   {variant=="supervisor"&&"Total Students"}
//                   {variant=="projects"&&"On Track"}
                  
//                   </h5>
//                  <p className={` ${variant=="projects"?"text-success ":"text-card-foreground"} text-2xl md:text-xl mt-1 font-semibold mb-2`}>4</p>
//                 </div>
//                 <div  className={`rounded-xl p-3 ${variant=="student"?"text-warning bg-warning/10":"text-secondary bg-secondary/10" } ${variant=="projects"&&"text-success bg-success/10"} `}>
//                   {variant=="student"&&  <Clock  className="size-6" />}
//                   {variant=="supervisor"&&  <Users className="size-6" />}
//                   {variant=="projects"&&  <CircleCheck className="size-5" />}
//                 </div>
//               </div>
//             </div>
//             <div className="card bg-card text-card-foreground rounded-xl border">
//               <div className="item-card p-6 flex items-center justify-between">
//                 <div className="flex flex-col">
//                         <h5 className={`${variant=="projects"?"text-muted-foreground font-normal":" text-foreground/80 mb-1 font-medium"} text-sm `}>
//                     {variant=="student"&&"Team Members"}
//                   {variant=="supervisor"&&"Completed Projects"}
//                   {variant=="projects"&&"At Risk"}
                    
//                   </h5>
//                   <p className={` ${variant=="projects"?"text-warning ":"text-card-foreground"} text-2xl md:text-xl mt-1 font-semibold mb-2`}>4</p>
//                 </div>
//                 <div className={`rounded-xl p-3  ${variant=="student"?"text-primary bg-primary/10":"text-success bg-success/10" }  ${variant=="projects"&&"text-warning bg-warning/10"} `}>
//                     {variant=="student"&&  <Users  className="size-6" />}
//                   {variant=="supervisor"&&  <CircleCheck className="size-6" />}
//                   {variant=="projects"&&  <CircleAlert className="size-5" />}
//                 </div>
//               </div>
//             </div>
//             <div className="card bg-card text-card-foreground rounded-xl border">
//               <div className="item-card p-6 flex items-center justify-between">
//                 <div className="flex flex-col">
//                        <h5 className={`${variant=="projects"?"text-muted-foreground font-normal":" text-foreground/80 mb-1 font-medium"} text-sm `}>
//                     {variant=="student"&&"Documents"}
//                     {variant=="supervisor"&&"Pending Reviews"}
//                   {variant=="projects"&&"Total Students"}
                    
//                   </h5>
//                   <p className="text-2xl md:text-xl mt-1 font-semibold mb-2">23</p>
//                 </div>
//                 <div  className={`rounded-xl p-3  ${variant=="student"&&"text-secondary bg-secondary/10"}  ${variant=="supervisor"&&"text-warning bg-warning/10"} ${variant=="projects"&&"text-secondary bg-secondary/10"} `}>
//                     {variant=="student"&&    <FileText className="size-6" />}
//                   {variant=="supervisor"&&  <Clock className="size-6" />}
//                   {variant=="projects"&&  <Users className="size-5" />}
               
//                 </div>
//               </div>
//             </div>
//           </div>
//   )
// }
// CardsInfoDashboard.tsx (لو الـ variant student بتستقبل props دلوقتي)
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Clock, Users, FileText } from "lucide-react";

export default function CardsInfoDashboard({
  variant,
  completedCount = 0,
  pendingCount = 0,
  teamCount = 0,
  documentsCount = 0,
}: {
  variant: string;
  completedCount?: number;
  pendingCount?: number;
  teamCount?: number;
  documentsCount?: number;
}) {
  if (variant === "student") {
    const cards = [
      { label: "Tasks Completed", value: `${completedCount}/${completedCount + pendingCount}`, icon: CircleCheck, color: "success" },
      { label: "Pending Tasks", value: pendingCount, icon: Clock, color: "warning" },
      { label: "Team Members", value: teamCount, icon: Users, color: "primary" },
      { label: "Documents", value: documentsCount, icon: FileText, color: "secondary" },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-0">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <h5 className="text-foreground/80 mb-1 font-medium text-sm">{c.label}</h5>
                <p className="text-2xl mt-1 font-semibold mb-2">{c.value}</p>
              </div>
              <div className={`rounded-xl p-3 text-${c.color} bg-${c.color}/10`}>
                <c.icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
if (variant === "supervisor") {
  const cards = [
    { label: "Tasks Completed", value: `${completedCount}/${completedCount + pendingCount}`, icon: CircleCheck, color: "success" },
    { label: "Pending Review", value: pendingCount, icon: Clock, color: "warning" },
    { label: "Total Students", value: teamCount, icon: Users, color: "primary" },
    { label: "Documents", value: documentsCount, icon: FileText, color: "secondary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((c) => (
        <Card key={c.label} className="p-0">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h5 className="text-foreground/80 mb-1 font-medium text-sm">{c.label}</h5>
              <p className="text-2xl mt-1 font-semibold mb-2">{c.value}</p>
            </div>
            <div className={`rounded-xl p-3 text-${c.color} bg-${c.color}/10`}>
              <c.icon className="size-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

  return null;
}