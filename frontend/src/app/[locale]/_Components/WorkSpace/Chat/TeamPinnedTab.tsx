import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Pin } from "lucide-react";
export default function TeamPinnedTab() {
  return (
    <Card className="p-0 border-t-0 border-b-0">
    <CardContent className="p-6 space-y-3">
<div className="p-4 rounded-lg border-2 border-warning/20 bg-warning/5">
<div className="flex items-start gap-3">
  <Pin className="size-4 text-warning mt-1"/>
  <div className="">
    <h3 className="text-sm mb-1">Project deadline: April 30, 2026</h3>
    <p className="text-xs text-muted-foreground">Pinned by Dr. Sarah Johnson</p>
  </div>
</div>
</div>
<div className="p-4 rounded-lg border-2 border-warning/20 bg-warning/5">
<div className="flex items-start gap-3">
  <Pin className="size-4 text-warning mt-1"/>
  <div className="">
    <h3 className="text-sm mb-1">Project deadline: April 30, 2026</h3>
    <p className="text-xs text-muted-foreground">Pinned by Dr. Sarah Johnson</p>
  </div>
</div>
</div>
<div className="p-4 rounded-lg border-2 border-warning/20 bg-warning/5">
<div className="flex items-start gap-3">
  <Pin className="size-4 text-warning mt-1"/>
  <div className="">
    <h3 className="text-sm mb-1">Project deadline: April 30, 2026</h3>
    <p className="text-xs text-muted-foreground">Pinned by Dr. Sarah Johnson</p>
  </div>
</div>
</div>
    </CardContent>
</Card>
  )
}
