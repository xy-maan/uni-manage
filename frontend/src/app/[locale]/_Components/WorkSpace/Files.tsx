import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  Download, EllipsisVertical, FileText, Plus, Upload } from "lucide-react";
export default function Files({variant}:{variant:string}) {
  return (
<Card className={`${variant=="team"&&"border-t-0 border-b-0 "}p-0 bg-card text-card-foreground `}>
  {variant=="main"&&   <CardHeader className="px-6 pt-6 gap-1.5">
<div className="flex items-center justify-between">
      <div className="flex flex-col">
      <h2 className="leading-none text-md font-medium">Project Files</h2>
      <p className="text-muted-foreground">Documents and resources for this project</p>
    </div>
    <Button >
      <Upload className="size-4 mr-2"/>
        Upload File
    </Button>
</div>
  </CardHeader>}

    <CardContent className={`${variant=="main"?"px-6 pb-6":"p-6"}`}>
<div className="space-y-2">
<div className={`${variant=="main"?"p-4 border-2":"p-3 border"} flex items-center justify-between rounded-lg  hover:border-primary/50  transition-all cursor-pointer`}>
<div className={`${variant=="main"?"gap-4":"gap-3"} flex  items-center`}>
<div className={`${variant=="main"&&"rounded-lg "} bg-primary/10 size-10  flex items-center justify-center`}>
<FileText className="size-5 text-primary"/>
</div>
<div className="">
  <h4 className={`${variant=="team"&&"font-medium"} text-sm`}>Project Proposal.pdf</h4>
  <p className="text-xs text-muted-foreground">2.4 MB • Uploaded by Sarah M. on Jan 15</p>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50  ">
  <Download className="size-4"/>
</Button>
</div>
<div className={`${variant=="main"?"p-4 border-2":"p-3 border"} flex items-center justify-between rounded-lg  hover:border-primary/50  transition-all cursor-pointer`}>
<div className={`${variant=="main"?"gap-4":"gap-3"} flex  items-center`}>
<div className={`${variant=="main"&&"rounded-lg "} bg-primary/10 size-10  flex items-center justify-center`}>
<FileText className="size-5 text-primary"/>
</div>
<div className="">
  <h4 className={`${variant=="team"&&"font-medium"} text-sm`}>Project Proposal.pdf</h4>
  <p className="text-xs text-muted-foreground">2.4 MB • Uploaded by Sarah M. on Jan 15</p>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50  ">
  <Download className="size-4"/>
</Button>
</div>
<div className={`${variant=="main"?"p-4 border-2":"p-3 border"} flex items-center justify-between rounded-lg  hover:border-primary/50  transition-all cursor-pointer`}>
<div className={`${variant=="main"?"gap-4":"gap-3"} flex  items-center`}>
<div className={`${variant=="main"&&"rounded-lg "} bg-primary/10 size-10  flex items-center justify-center`}>
<FileText className="size-5 text-primary"/>
</div>
<div className="">
  <h4 className={`${variant=="team"&&"font-medium"} text-sm`}>Project Proposal.pdf</h4>
  <p className="text-xs text-muted-foreground">2.4 MB • Uploaded by Sarah M. on Jan 15</p>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50  ">
  <Download className="size-4"/>
</Button>
</div>
<div className={`${variant=="main"?"p-4 border-2":"p-3 border"} flex items-center justify-between rounded-lg  hover:border-primary/50  transition-all cursor-pointer`}>
<div className={`${variant=="main"?"gap-4":"gap-3"} flex  items-center`}>
<div className={`${variant=="main"&&"rounded-lg "} bg-primary/10 size-10  flex items-center justify-center`}>
<FileText className="size-5 text-primary"/>
</div>
<div className="">
  <h4 className={`${variant=="team"&&"font-medium"} text-sm`}>Project Proposal.pdf</h4>
  <p className="text-xs text-muted-foreground">2.4 MB • Uploaded by Sarah M. on Jan 15</p>
</div>
</div>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50  ">
  <Download className="size-4"/>
</Button>
</div>
</div>
    </CardContent>
</Card>

)
}
