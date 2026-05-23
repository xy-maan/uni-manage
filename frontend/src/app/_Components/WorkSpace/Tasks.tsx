import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import React from "react";

export default function Tasks() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Task Board</h2>
        <Button>
          <Plus className=" mr-2 size-4" />
          Add Task
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* to do */}
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3>To Do</h3>
            <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
              2
            </Badge>
          </div>
        
<div className="space-y-3">

          <Card className="p-0 border-l-4 border-l-muted-foreground gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-warning/10 text-warning">medium</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
              <Card className="p-0 border-l-4 border-l-muted-foreground gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-warning/10 text-warning">medium</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
</div>
        </div>
        {/* in progress */}
           <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3>In Progress</h3>
            <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
              2
            </Badge>
          </div>
<div className="space-y-3">

          <Card className="p-0 border-l-4 border-l-warning gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-destructive/10 text-destructive">high</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
              <Card className="p-0 border-l-4 border-l-warning gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-destructive/10 text-destructive">high</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
</div>
        </div>
        {/* done */}
          <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3>Done</h3>
            <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
              2
            </Badge>
          </div>
<div className="space-y-3">

          <Card className="p-0 border-l-4 border-l-success gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-muted text-muted-foreground">high</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
              <Card className="p-0 border-l-4 border-l-success gap-0"  >
<CardHeader className=" flex items-center justify-between p-4 pb-0 mb-3">
<h2 className="flex-1 pr-2">Research AI Models</h2>
<Badge className="bg-muted text-muted-foreground">high</Badge>
</CardHeader>
<CardContent className="p-4 pb-6 pt-0">

  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">Evaluate different AI models for the study assistant</p>
  <div className="flex items-center justify-between text-sm text-foreground/70">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Calendar className="size-4"/>
        <span>Feb 5</span>
      </div>
        <div className="flex items-center gap-1">
        <MessageSquare className="size-4 mt-0.5"/>
        <span>5</span>
      </div>
    </div>
    <Badge className="bg-muted text-xs text-foreground/70">AC</Badge>
  </div>
</CardContent>
          </Card>
</div>
        </div>
      </div>
    </div>
  );
}
