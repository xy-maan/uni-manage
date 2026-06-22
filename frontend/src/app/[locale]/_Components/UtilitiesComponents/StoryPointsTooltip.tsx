"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function StoryPointsTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
        </TooltipTrigger>

        <TooltipContent className="max-w-xs">
          <div className="space-y-2 text-sm">
            <p>
              <strong>Story Points</strong> measure the relative effort
              required to complete a task.
            </p>

            <p>
              They consider factors like complexity, risk, and the amount
              of work involved.
            </p>

            <p>
              Teams often use values like <strong>1, 2, 3, 5, 8, 13</strong>
              instead of estimating time in hours.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}