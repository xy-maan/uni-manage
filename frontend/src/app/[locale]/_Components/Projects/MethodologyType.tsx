// "use client";
// import React, { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { CircleCheck, Info, LayoutGrid, Target, Zap } from "lucide-react";
// import LearnMore from "./LearnMore";
// import { UseFormReturn } from "react-hook-form";
// import { createProjectValues } from "@/types/schema";
// type Methodology=  "kanban" | "sprint" | "milestone" | null
// export default function MethodologyType({formObj,setSelectedMethType,selectedMethType}:{formObj:UseFormReturn<createProjectValues>;  setSelectedMethType: (
//   methodology:Methodology
// ) => void;
//  selectedMethType:Methodology}) {
//   return (
//     <div className="flex flex-col gap-3">
// .
//     <div className="grid md:grid-cols-2 gap-4 ">
//       <div
//         className={`relative p-6 rounded-lg border-2 transition-all text-left ${selectedMethType == "sprint" ? "border-primary/20 bg-primary/5 " : "border-border hover:border-primary/50 hover:bg-muted/50"}  `}
//         onClick={() => {
//           setSelectedMethType("sprint");
//             formObj.setValue("methodology", "sprint");
//         }}
//       >
//         <div className="flex flex-col items-start space-y-3">
//           <div
//             className={`size-12 rounded-lg flex items-center justify-center bg-primary/10  text-primary`}
//           >
//             <Zap className="size-6" />
//           </div>
//           <div className="flex flex-col items-start ">
//             <h4 className="mb-1">Sprint-Based</h4>
//             <Badge className="bg-primary/10 text-primary mb-2">
//               Agile-Inspired
//             </Badge>
//             <p className="text-sm text-muted-foreground">
//               Work in focused time-boxed sprint with regular reviews and
//               adaptations.
//             </p>
//           </div>
//           <LearnMore variant="agile" />
//         </div>
//         {selectedMethType == "sprint" && (
//           <CircleCheck className="size-5 text-primary absolute top-4 right-4" />
//         )}
//       </div>
//       <div
//         className={`relative p-6 rounded-lg border-2 transition-all text-left ${selectedMethType == "milestone" ? "border-secondary/20 bg-secondary/5 " : "border-border hover:border-scbg-secondary/50 hover:bg-muted/50"}  `}
//        onClick={() => {
//           setSelectedMethType("milestone");
//             formObj.setValue("methodology", "milestone");
//         }}
//       >
//         <div className="flex flex-col items-start space-y-3">
//           <div
//             className={`size-12 rounded-lg flex items-center justify-center bg-secondary/10  text-secondary`}
//           >
//             <Target className="size-6"/>
//             </div>
//           <div className="flex flex-col items-start  ">
//             <h4 className="mb-1">Milestone-Based</h4>
//             <Badge className="bg-secondary/10 text-secondary mb-2">
//               Waterfall-Inspired
//             </Badge>
//             <p className="text-sm text-muted-foreground">
//               Progress through sequential phases with clear milestone and
//               deliverables.
//             </p>
//           </div>
//              <LearnMore variant="waterfall" />

//       </div>
//         {selectedMethType == "milestone" && (
//           <CircleCheck className="size-5 text-secondary absolute top-4 right-4" />
//         )}
//       </div>
//       <div
//         className={`relative p-6 rounded-lg border-2 transition-all text-left ${selectedMethType == "kanban" ? "border-success/20 bg-success/5 " : "border-border hover:border-success/50 hover:bg-muted/50"}  `}
//        onClick={() => {
//           setSelectedMethType("kanban");
//             formObj.setValue("methodology", "kanban");
//         }}
//       >
//         <div className="flex flex-col items-start space-y-3">
//           <div
//             className={`size-12 rounded-lg flex items-center justify-center bg-success/10  text-success`}
//           >
//             <LayoutGrid className="size-6" />
//           </div>
//           <div className="flex flex-col items-start ">
//             <h4 className="mb-1">Flexible Board</h4>
//             <Badge className="bg-success/10 text-success mb-2">
//               Kanban-Inspired
//             </Badge>
//             <p className="text-sm text-muted-foreground">
//               Visualize workflow and optimize flow with a flexible task board.
//             </p>
//           </div>
//              <LearnMore variant="kanban" />
       
//         </div>
//         {selectedMethType == "kanban" && (
//           <CircleCheck className="size-5 text-success absolute top-4 right-4" />
//         )}
//       </div>
//     </div>
//     </div>
//   );
// }
"use client";

import { CircleCheck, Flag, Info, LayoutGrid, Target, Zap } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { createProjectValues } from "@/types/schema";
import { Card, CardContent } from "@/components/ui/card";
import LearnMore from "./LearnMore";
type Methodology=  "kanban" | "sprint" | "milestone" | null
export default function MethodologyType({formObj,setSelectedMethType,selectedMethType}:{formObj:UseFormReturn<createProjectValues>;  setSelectedMethType: (
  methodology:Methodology
) => void;
 selectedMethType:Methodology}) {
  return (
    <div className='space-y-3 py-2'>
        <p className="text-sm text-muted-foreground">How will your team organize work?</p>


<Card className={`relative ${selectedMethType=="sprint"?"border-primary bg-primary/5 ":""} cursor-pointer transition-all hover:border-primary/60  p-0`}  onClick={() => {
  setSelectedMethType("sprint");
  formObj.setValue("methodology", "sprint");
}} >

    <CardContent className='p-4  pb-6'>
              <div className="flex items-start gap-3 ">

                  <div className={`p-2 rounded-lg shrink-0  ${selectedMethType=="sprint"?"bg-primary text-primary-foreground":"bg-muted"}`}>

<Zap className="size-6"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Sprint (Agile)</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Fixed time-boxed iterations with planning, review, and retrospective cycles. Best for iterative, adaptable projects.</p>
                </div>
                 {selectedMethType=="sprint"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>}
              </div>
                 <LearnMore variant="agile" />
        </CardContent>
        
</Card>


<Card className={`relative ${selectedMethType=="milestone"?"border-primary bg-primary/5 ":""} cursor-pointer transition-all hover:border-primary/60  p-0`}  onClick={() => {
  setSelectedMethType("milestone");
  formObj.setValue("methodology", "milestone");
}} >

    <CardContent className='p-4 pb-6'>
              <div className="flex items-start gap-3">

                  <div className={`p-2 rounded-lg shrink-0  ${selectedMethType=="milestone"?"bg-primary text-primary-foreground":"bg-muted"}`}>

<Flag className="size-6"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Milestone</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Sequential phases with defined gates. Best for well-scoped projects with clear deliverables at each phase.</p>
                </div>
                 {selectedMethType=="milestone"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>}
              </div>
                  <LearnMore variant="waterfall" />
        </CardContent>
        
</Card>

    
<Card className={`relative ${selectedMethType=="kanban"?"border-primary bg-primary/5 ":""} cursor-pointer transition-all hover:border-primary/60  p-0`}  onClick={() => {
  setSelectedMethType("kanban");
  formObj.setValue("methodology", "kanban");
}} >

    <CardContent className='p-4  pb-6'>
              <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0  ${selectedMethType=="kanban"?"bg-primary text-primary-foreground":"bg-muted"}`}>

<LayoutGrid className="size-6"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Kanban (Flexible)</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Continuous flow with visual columns and WIP limits. Best for ongoing work without fixed iterations.</p>
                </div>
                 {selectedMethType=="kanban"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>}
              </div>
                  <LearnMore variant="kanban" />
        </CardContent>
        
</Card>    
    </div>
  );
}
