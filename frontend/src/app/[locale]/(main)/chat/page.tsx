import ChatProjectFiltering from "@/app/[locale]/_Components/WorkSpace/Chat/ChatProjectFiltering";
import MeassageFilter from "@/app/[locale]/_Components/WorkSpace/Chat/MeassageFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Circle, MessageCircle, Search,Pin, User, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

export default function ChatPage() {
  return (
    <div className="w-full">
      <div className="border-b bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageCircle className="size-6 text-white" />
              </div>
              <div className="">
                <h1 className="text-2xl lg:text-3xl font-bold">Messages</h1>
                <p className="text-sm text-muted-foreground">9 conversations</p>
              </div>
            </div>
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className=" absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                id="search"
                className=" p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md  px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
                placeholder="Search messages..."
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-6">
<div className="grid gap-6 lg:grid-cols-[280px_1fr]">

  <div className="space-y-4 ">
  <MeassageFilter/>
      <Separator />
      <ChatProjectFiltering/>
      <Separator />
<Card className="p-0 bg-muted/30">
    <CardContent className="p-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
<span className="text-muted-foreground">Active Chats</span>
    <Badge className="">9</Badge>
      </div>
        <div className="flex items-center justify-between text-sm">
<span className="text-muted-foreground">Needs Reply</span>
    <Badge className="">9</Badge>
      </div>
    </CardContent>
</Card>
  </div>
  <div className="space-y-4">
  <div className="space-y-3">

    <div className="flex items-center justify-between px-1">
<div className="gap-2 flex items-center">
  <Pin className="size-4 text-primary"/>
  <h3 className="font-semibold text-sm">Pinned</h3>
</div>
<Badge className="bg-secondary text-secondary-foreground">3</Badge>
    </div> 
    {/* card Direct */}
    <Card className="p-0 border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
    <CardContent className="p-4 pb-6">
      <div className="flex gap-3 items-start ">
        <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
        <User className="size-5"/>
        </div>

       <div className="flex-1">
         <div className="flex items-center justify-between mb-1.5 gap-2">
          <div className="flex items-center gap-2">
          <h4 className="font-semibold  text-base">mariem</h4>
          <Pin className="size-3.5 text-primary fill-primary/20"/>
          </div>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <User className="size-3 mr-1"/>
            Direct
          </Badge>
          <Badge className="px-2 py-0.5 bg-muted/50">AI Study Assistant</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          Hey! I saw your profile on the team finder. Are you interested in joining our AI project?
        </p>

        <div className="flex items-center justify-end">
          <Badge className="">3 new</Badge>
        </div>
       </div>
      </div>

    </CardContent>
</Card>
    <Card className="p-0 border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
    <CardContent className="p-4 pb-6">
      <div className="flex gap-3 items-start ">
        <div className="size-11 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-secondary">
        <Users className="size-5"/>
        </div>

       <div className="flex-1">
         <div className="flex items-center justify-between mb-1.5 gap-2">
          <div className="flex items-center gap-2">
          <h4 className="font-semibold  text-base">Team Alpha, 4 members</h4>
          <Pin className="size-3.5 text-primary fill-primary/20"/>
          </div>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
            <Users className="size-3 mr-1"/>
            Project Team
          </Badge>
          <Badge className="px-2 py-0.5 bg-muted/50">AI Study Assistant</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          Hey! I saw your profile on the team finder. Are you interested in joining our AI project?
        </p>

        <div className="flex items-center justify-end">
          <Badge className="">3 new</Badge>
        </div>
       </div>
      </div>

    </CardContent>
</Card>
  </div>
  <div className="space-y-3">

    <div className="flex items-center justify-between px-1">
<div className="gap-2 flex items-center">
  <Clock className="size-4 text-primary"/>
  <h3 className="font-semibold text-sm">Recent</h3>
</div>
<Badge className="bg-secondary text-secondary-foreground">3</Badge>
    </div> 
    {/* card Direct */}
    <Card className="p-0 border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
    <CardContent className="p-4 pb-6">
      <div className="flex gap-3 items-start ">
        <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
        <User className="size-5"/>
        </div>

       <div className="flex-1">
         <div className="flex items-center justify-between mb-1.5 gap-2">
          <div className="flex items-center gap-2">
          <h4 className="font-semibold  text-base">mariem</h4>
          <Pin className="size-3.5 text-primary fill-primary/20"/>
          </div>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <User className="size-3 mr-1"/>
            Direct
          </Badge>
          <Badge className="px-2 py-0.5 bg-muted/50">AI Study Assistant</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          Hey! I saw your profile on the team finder. Are you interested in joining our AI project?
        </p>

        <div className="flex items-center justify-end">
          <Badge className="">3 new</Badge>
        </div>
       </div>
      </div>

    </CardContent>
</Card>
    <Card className="p-0 border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
    <CardContent className="p-4 pb-6">
      <div className="flex gap-3 items-start ">
        <div className="size-11 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-secondary">
        <Users className="size-5"/>
        </div>

       <div className="flex-1">
         <div className="flex items-center justify-between mb-1.5 gap-2">
          <div className="flex items-center gap-2">
          <h4 className="font-semibold  text-base">Team Alpha, 4 members</h4>
          <Pin className="size-3.5 text-primary fill-primary/20"/>
          </div>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
            <Users className="size-3 mr-1"/>
            Project Team
          </Badge>
          <Badge className="px-2 py-0.5 bg-muted/50">AI Study Assistant</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          Hey! I saw your profile on the team finder. Are you interested in joining our AI project?
        </p>

        <div className="flex items-center justify-end">
          <Badge className="">3 new</Badge>
        </div>
       </div>
      </div>

    </CardContent>
</Card>
  </div>
  </div>
</div>
      </div>
    </div>
  );
}
