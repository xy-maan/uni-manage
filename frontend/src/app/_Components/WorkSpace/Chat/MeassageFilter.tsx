"use client"
import React from 'react'
import { useState } from "react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Circle, User, Users, MessageCircle, Search } from "lucide-react";
export default function MeassageFilter() {
      const [active, setActive] = useState("all")

  return (
    <>
    <div className="space-y-1.5">
      <Button className={`${active=="all"?"bg-primary":"bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("all")}>
      <MessageCircle className="size-4 mr-2.5"/>
      <span className="flex-1 text-left">All Messages</span>
      <Badge className={`${active=="all"?"bg-secondary text-secondary-foreground":"" }  ml-auto text-xs`}>9</Badge>
      </Button>
       <Button className={`${active=="unread"?"bg-primary":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("unread")}>
      <Circle className="size-3.5 mr-2.5 fill-current"/>
      <span className="flex-1 text-left">Unread</span>
      <Badge className={`${active=="unread"?"bg-secondary text-secondary-foreground":"" }  ml-auto text-xs`}>9</Badge>
      </Button>

    </div>    
    <Separator />
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 ">Chat Type</p>
      <Button className={`${active=="direct"?"bg-primary":"bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("direct")}>
      <User className="size-4 mr-2.5"/>
      <span className="flex-1 text-left">Direct</span>
       <Badge className={`${active=="direct"?"bg-secondary text-secondary-foreground":"" } items-start justify-start text-xs`}>9</Badge>
      </Button>
       <Button className={`${active=="groups"?"bg-primary":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"} w-full`}  onClick={() => setActive("groups")}>
      <Users className="size-3.5 mr-2.5"/>
      <span className="flex-1 text-left">Groups</span>
       <Badge className={`${active=="groups"?"bg-secondary text-secondary-foreground":"" } items-start justify-start text-xs`}>9</Badge>
      </Button>

    </div>
    
    </>
  )
}
