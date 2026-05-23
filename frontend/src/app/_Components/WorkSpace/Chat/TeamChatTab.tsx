import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";
export default function TeamChatTab() {
  return (
    // <Card className="p-0 rounded-none ">

      <CardContent className="p-6 space-y-4 flex-1 overflow-y-auto">
        
        <div className="flex gap-3 ">
          <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-secondary text-white flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              <Badge className="role text-xs bg-secondary/10 text-secondary">Supervisor</Badge>
              <span className="text-xs text-muted-foreground">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-muted">
                <p className="text-sm">
                  Great progress on the authentication module! The implementation looks solid. A few suggestions in the code review.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-row-reverse">
            <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-muted flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-end flex-1 min-w-0">
            <div className="flex items-baseline  gap-2 mb-1 ">
              <span className="text-sm font-medium ">You</span>
              <span className="text-xs text-muted-foreground leading-none ">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-primary text-white">
                <p className="text-sm">
                Thank you! I'll address the feedback today.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCheck className="size-3 text-primary"/>
            </div>
          </div>
        </div>
          <div className="flex gap-3 ">
          <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-secondary text-white flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              <Badge className="role text-xs bg-secondary/10 text-secondary">Supervisor</Badge>
              <span className="text-xs text-muted-foreground">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-muted">
                <p className="text-sm">
                  Great progress on the authentication module! The implementation looks solid. A few suggestions in the code review.
                </p>
              </div>
            </div>
          </div>
        </div>
           <div className="flex gap-3 ">
          <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-secondary text-white flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              <Badge className="role text-xs bg-secondary/10 text-secondary">Supervisor</Badge>
              <span className="text-xs text-muted-foreground">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-muted">
                <p className="text-sm">
                  Great progress on the authentication module! The implementation looks solid. A few suggestions in the code review.
                </p>
              </div>
            </div>
          </div>
        </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-muted flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-end flex-1 min-w-0">
            <div className="flex items-baseline  gap-2 mb-1 ">
              <span className="text-sm font-medium ">You</span>
              <span className="text-xs text-muted-foreground leading-none ">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-primary text-white">
                <p className="text-sm">
                Thank you! I'll address the feedback today.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCheck className="size-3 text-primary"/>
            </div>
          </div>
        </div>
          <div className="flex gap-3 ">
          <div className="relative flex size-10 text-md shrink-0  rounded-full">
            <span className="bg-secondary text-white flex size-full items-center justify-center rounded-full">
             SJ
            </span>
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              <Badge className="role text-xs bg-secondary/10 text-secondary">Supervisor</Badge>
              <span className="text-xs text-muted-foreground">10:30 AM</span>
            </div>
            <div className="max-w-[70%] items-start flex flex-col gap-2">
              <div className="rounded-2xl px-4 py-2 bg-muted">
                <p className="text-sm">
                  Great progress on the authentication module! The implementation looks solid. A few suggestions in the code review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    // </Card>
  );
}
