import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  EllipsisVertical, Plus } from "lucide-react";
export default function Teams() {
  return (
    <div>
<Card className="p-0 bg-card text-card-foreground">
  <CardHeader className="flex items-center justify-between  px-6 pt-6 ">
    <div className="flex flex-col">
      <h2 className="leading-none text-md font-medium">Team Members</h2>
      <p className="text-muted-foreground">People working on this project</p>
    </div>
    <Button>
      <Plus className="size-4 mr-2"/>
      Add Member
    </Button>
  </CardHeader>
    <CardContent className="px-6 pb-6">
<div className="space-y-4">
  <Card className="p-0 ">
    <CardContent className="p-4 pb-6">
<div className="flex items-center justify-between">
<div className="flex gap-4 items-center">
<div className="relative flex size-12 shrink-0  rounded-full">
<span className="bg-muted flex size-full items-center justify-center rounded-full">MH</span>
</div>
<div className="">
  <h4>Sarah Martinez</h4>
  <p className="text-sm text-muted-foreground mb-1">Team Lead</p>
 <div className="flex gap-1">
   <Badge className="bg-secondary text-secondary-foreground">React</Badge>
   <Badge className="bg-secondary text-secondary-foreground">Node.js</Badge>
 </div>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
  <EllipsisVertical className="size-4"/>
</Button>
</div>
    </CardContent>
</Card>
  <Card className="p-0 ">
    <CardContent className="p-4 pb-6">
<div className="flex items-center justify-between">
<div className="flex gap-4 lg:items-center itemsstart ">
<div className="relative flex size-12 shrink-0  rounded-full">
<span className="bg-muted flex size-full items-center justify-center rounded-full">MH</span>
</div>
<div className="">
  <h4>Sarah Martinez</h4>
  <p className="text-sm text-muted-foreground mb-1">Team Lead</p>
 <div className="flex gap-1">
   <Badge className="bg-secondary text-secondary-foreground">React</Badge>
   <Badge className="bg-secondary text-secondary-foreground">Node.js</Badge>
 </div>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
  <EllipsisVertical className="size-4"/>
</Button>
</div>
    </CardContent>
</Card>
  <Card className="p-0 ">
    <CardContent className="p-4 pb-6">
<div className="flex items-center justify-between">
<div className="flex gap-4 items-center">
<div className="relative flex size-12 shrink-0  rounded-full">
<span className="bg-muted flex size-full items-center justify-center rounded-full">MH</span>
</div>
<div className="">
  <h4>Sarah Martinez</h4>
  <p className="text-sm text-muted-foreground mb-1">Team Lead</p>
 <div className="flex gap-1">
   <Badge className="bg-secondary text-secondary-foreground">React</Badge>
   <Badge className="bg-secondary text-secondary-foreground">Node.js</Badge>
 </div>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
  <EllipsisVertical className="size-4"/>
</Button>
</div>
    </CardContent>
</Card>
</div>
    </CardContent>
</Card>

      
    </div>
  )
}
