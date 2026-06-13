"use client"
import React from 'react'
import { useState } from "react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Circle, GraduationCap, MessageCircle, Search } from "lucide-react";
export default function ChatProjectFiltering() {
      const [active, setActive] = useState("all")
  return (
      <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 ">Projects</p>
      <Button className={`${active=="all"?"bg-primary":"bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("all")}>
<div className="justify-between items-center flex">
          <GraduationCap className="size-4 mr-2.5"/>
      <span className="flex-1 text-left">All Projects</span>
</div>
      <Badge className={`${active=="all"?"bg-secondary text-secondary-foreground":"" }  ml-auto text-xs`}>9</Badge>
      </Button>
       <Button className={`${active=="AI"?"bg-primary":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("AI")}>
       <div className="justify-between flex w-full">
      <span className="flex-1 text-left">AI Study Assistant</span>
      <Badge className={`${active=="AI"?"bg-secondary text-secondary-foreground":"" } items-start justify-start text-xs`}>9</Badge>
       </div>
      </Button>
         <Button className={`${active=="healthcare"?"bg-primary":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("healthcare")}>
     <div className="justify-between flex w-full">

      <span className="flex-1 text-left">Healthcare Data Analytics</span>
      <Badge className={`${active=="healthcare"?"bg-secondary text-secondary-foreground":"" }  text-xs`}>9</Badge>
     </div>
      </Button>

    </div>
  )
}