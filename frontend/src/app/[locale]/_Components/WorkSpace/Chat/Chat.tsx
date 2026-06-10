import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import {  Download, FileText, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatCard from './TeamChatTab';
import ContentChat from './TeamChatTab';
import TeamChatTab from './TeamChatTab';
import TeamPinnedTab from './TeamPinnedTab';
import TeamFilesTab from './TeamFilesTab';
import Files from '../Files';

export default function Chat() {
  return (
<Card className="p-0 bg-card text-card-foreground h-150">
  <CardHeader className=" px-6 pt-6 border-b">
<div className="flex items-center justify-between">
      <h4 className="leading-none text-md">Team Collaboration</h4>
      <div className="flex items-center gap-2">
    <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
       <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>SM</AvatarFallback>
      </Avatar>
      <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>SM</AvatarFallback>
      </Avatar>
       <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>SM</AvatarFallback>
      </Avatar>
            <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>SM</AvatarFallback>
      </Avatar>
    </AvatarGroup>
    
<Badge className='bg-success/10 text-success'><span className='size-2 bg-success rounded-full mr-1.5'></span> 4 online
</Badge>
      </div>
</div>
  </CardHeader>
      <Tabs defaultValue="Chat" className="gap-2 flex-1 flex flex-col min-h-0">
<div className="px-6 pt-4 border-b">

        <TabsList className="  w-full rounded-xl">
          <TabsTrigger value="Chat">Chat </TabsTrigger>
          <TabsTrigger value="Pinned">Pinned </TabsTrigger>
          <TabsTrigger value="Files">Files </TabsTrigger>
        </TabsList>
      </div>
      
        <TabsContent value="Chat" className=" min-h-0  flex-1 flex flex-col">
          <TeamChatTab/>
        </TabsContent>
        <TabsContent value="Pinned" className="space-y-4">
          <TeamPinnedTab/>
        </TabsContent>
        <TabsContent value="Files" className="space-y-4">
          <Files variant="team"/>
        </TabsContent>
      </Tabs>

    {/* </CardContent> */}
</Card>  
  )
}
