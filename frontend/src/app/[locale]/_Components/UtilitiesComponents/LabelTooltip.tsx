// "use client";
// import { Info } from "lucide-react";
// import {
// Tooltip,
// TooltipContent,
// TooltipProvider,
// TooltipTrigger,
// } from "@/components/ui/tooltip";

// export default function LabelTooltip() {
// return ( <TooltipProvider> <Tooltip> <TooltipTrigger asChild> <Info className="size-4 text-muted-foreground cursor-pointer hover:text-foreground" />

//  </TooltipTrigger>

//     <TooltipContent className="max-w-xs">
//       <div className="space-y-2 text-sm">
//         <p>
//           <strong>WIP Limit</strong> stands for
//           <strong> Work In Progress Limit</strong>.
//         </p>

//         <p>
//           It controls how many tasks can be actively worked on in a
//           workflow stage at the same time.
//         </p>

//         <p>
//           Example: If the limit is <strong>3</strong>, only three tasks
//           can stay in the <strong>In Progress</strong> column
//           simultaneously.
//         </p>
//       </div>
//     </TooltipContent>
//   </Tooltip>
// </TooltipProvider>
// );
// }

"use client";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LabelTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2 text-sm">
            <p>
              <strong>WIP Limit</strong> stands for
              <strong> Work In Progress Limit</strong>.
            </p>
            <p>
              It controls how many tasks can be actively worked on in a
              workflow stage at the same time.
            </p>
            <p>
              Example: If the limit is <strong>3</strong>, only three tasks
              can stay in the <strong>In Progress</strong> column
              simultaneously.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}