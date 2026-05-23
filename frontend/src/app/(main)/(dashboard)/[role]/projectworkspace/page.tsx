import Chat from "@/app/_Components/WorkSpace/Chat/Chat";
import Files from "@/app/_Components/WorkSpace/Files";
import Tasks from "@/app/_Components/WorkSpace/Tasks";
import Teams from "@/app/_Components/WorkSpace/Teams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, Users } from "lucide-react";
import React from "react";

export default function WorkSpace() {
  
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="header mb-8">
        <div className="flex justify-between lg:items-center items-start ">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1>AI-Powered Study Assistant</h1>
              <Badge>Development</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              An intelligent platform that helps students organize their study
              materials, generate personalized study plans, and track their
              learning progress using AI.
            </p>
          </div>
          <Button variant="outline">
            <Settings className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Users className="size-4" />4 members
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />4 members
          </div>
          <span>Supervisor: Dr. Sarah Johnson</span>
        </div>

        <Card className="p-0">
          <CardContent className="p-6 pb-6">
            <Field className="w-full gap-2">
              <FieldLabel
                htmlFor="progress-upload"
                className=" text-sm font-medium flex items-center justify-between"
              >
                <span className="">Overall Progress</span>
                <span className="">65%</span>
              </FieldLabel>
              <Progress
                value={66}
                id="progress-upload"
                className="bg-muted  [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
              />
            </Field>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="Tasks" className="w-full">
        <TabsList className=" mb-6 rounded-xl">
          <TabsTrigger value="Tasks">Tasks </TabsTrigger>
          <TabsTrigger value="Team">Team </TabsTrigger>
          <TabsTrigger value="Files">Files </TabsTrigger>
          <TabsTrigger value="Chat">Chat </TabsTrigger>
        </TabsList>
        <TabsContent value="Tasks" className="space-y-4">
          <Tasks />
        </TabsContent>
        <TabsContent value="Team" className="space-y-4">
          <Teams  />
        </TabsContent>
        <TabsContent value="Files" className="space-y-4">
          <Files variant="main" />
        </TabsContent>
        <TabsContent value="Chat" className="space-y-4">
          <Chat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
