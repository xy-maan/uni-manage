import FilteringNotifications from "@/app/[locale]/_Components/Notifications/FilteringNotifications/FilteringNotifications";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Bell,
  CheckCheck,
  CircleCheck,
  CircleX,
  Eye,
  FileText,
  Funnel,
  MessageSquare,
  MessagesSquare,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="">
          <h1 className="mb-2 text-2xl font-medium">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with team invitations, supervisor responses, and
            AI-powered recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="">
            <CheckCheck className="size-4 mr-2" />
            Mark All as Read
          </Button>
          <Button variant="outline" className="">
            <Trash2 className="size-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between ">
            <div className="">
              <p className="text-sm text-muted-foreground">Total</p>
              <h3 className="text-2xl mt-1">12</h3>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="size-6  text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between ">
            <div className="">
              <p className="text-sm text-muted-foreground">Unread</p>
              <h3 className="text-2xl mt-1">7</h3>
            </div>
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Badge className="bg-destructive text-white flex items-center justify-center text-base">
                7
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between ">
            <div className="">
              <p className="text-sm text-muted-foreground">Total</p>
              <h3 className="text-2xl mt-1">12</h3>
            </div>
            <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCheck className="size-6  text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Funnel className="size-4" />
          Filter by type:
        </div>
        <FilteringNotifications />
      </div>

      <div className="">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="All">
              All{" "}
              <Badge className=" bg-secondary text-secondary-foreground">
                10
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="Unread">
              Unread{" "}
              <Badge className=" bg-secondary text-secondary-foreground">
                10
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="Read">
              Read{" "}
              <Badge className=" bg-secondary text-secondary-foreground">
                10
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="All" className="space-y-4">
            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <Users className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Invitation</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                        <Badge className=" bg-destructive text-destructive-foreground">
                          HIGH
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">
                      Project:{" "}
                    </span>
                    <span className="text-sm font-medium">
                      AI-Powered Student Assistant
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Building an intelligent chatbot system to help students with
                    course selection, scheduling, and academic planning using
                    natural language processing.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-foreground gap-1 ">
                      {" "}
                      <UserCheck className="size-3 mr-1" />
                      Frontend Developer
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      React
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      TypeScript
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className="bg-success hover:bg-success/90 py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5">
                        <CircleCheck className="size-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="py-0 text-foreground h-8 px-3 has-[>svg]:px-2.5 gap-1.5"
                      >
                        <CircleX className="size-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Message</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      From:{" "}
                    </span>
                    <span className="text-sm font-medium"> Alex Chen</span>
                    <Badge variant="outline" className=" ">
                      Team Lead
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Hey team! Just uploaded the latest UI mockups to the shared
                    drive. Please review them before our meeting tomorrow.
                  </p>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-1.5">
                        <Eye className="size-4 mr-1" />
                        View Message
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <CircleCheck className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Task Deadline</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">2h ago</span>
                  </div>
               <div className="mb-2 flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">Task: </span>
                  <span className="text-sm font-medium"> Complete Database Schema Design</span>
                      
               </div>
                   <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Due in 2 days
                    </Badge>
                  </div>

               <div className="flex justify-between">
               <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-0">
                <Eye className="size-4 mr-1"/>
                View Task
               </Button>
                <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                  <Trash2 className="size-4"/>
                </Button>
               </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Supervisor Message</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      From:{" "}
                    </span>
                    <span className="text-sm font-medium"> Dr. James Wilson</span>
                    <Badge variant="outline" className=" gap-1 ">
                      Primary Supervisor
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                   Great progress on the authentication module! I've reviewed your code and left some comments. Let's discuss the security improvements in our next meeting.
                  </p>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-1.5">
                        <Eye className="size-4 mr-1" />
                        View Message
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
              <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <CircleCheck className="size-6 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Supervisor Message</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  {/* <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      From:{" "}
                    </span>
                    <span className="text-sm font-medium"> Dr. James Wilson</span>
                    <Badge className="text-foreground bg-transparent hover:bg-transparent border border-border gap-1 ">
                      Primary Supervisor
                    </Badge>
                  </div> */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
Dr. James Wilson has accepted your supervision request!
                  </p>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-1.5">
                        <Eye className="size-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                    <Button  className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
             <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <FileText className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Task Assignment</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">2h ago</span>
                  </div>
               <div className="mb-2 flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">Task: </span>
                  <span className="text-sm font-medium"> Implement Authentication Module</span>
                      
               </div>
                   <div className="flex flex-wrap gap-2 mb-3 text-sm font-medium">
                    <Badge className="bg-secondary text-secondary-foreground">
                     Assigned By
                    </Badge>
                    Sarah Martinez
                  </div>

               <div className="flex justify-between">
               <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-0">
                <Eye className="size-4 mr-1"/>
                View Task
               </Button>
                <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                  <Trash2 className="size-4"/>
                </Button>
               </div>
                </div>
              </CardContent>
            </Card>
  <Card className="p-0 bg-card border-2 border-border hover:border-primary/20">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <Users className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Invitation</h4>
                        <Badge className="bg-warning text-warning-foreground">
                          MEDIUM
                        </Badge>
                        {/* <Badge className=" bg-destructive text-destructive-foreground">
                          HIGH
                        </Badge> */}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">
                      Project:{" "}
                    </span>
                    <span className="text-sm font-medium">
                      Campus Event Management Platform
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Building an intelligent chatbot system to help students with
                    course selection, scheduling, and academic planning using
                    natural language processing.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-foreground gap-1 ">
                      {" "}
                      <UserCheck className="size-3 mr-1" />
                      Frontend Developer
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      React
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      TypeScript
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className="bg-success hover:bg-success/90 py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5">
                        <CircleCheck className="size-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="py-0 text-foreground h-8 px-3 has-[>svg]:px-2.5 gap-1.5"
                      >
                        <CircleX className="size-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                <Card className="p-0 bg-card border-2 border-border hover:border-primary/20">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-destructive/10 flex items-center justify-center ring-2 ring-destructive/20">
                  <CircleX className="size-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      {/* <div className="flex items-center gap-2 flex-wrap"> */}
                        <h4>Supervisor Request Declined
</h4>
                      {/* </div> */}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                 
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
Dr. Michael Chang has declined your supervision request.
                  </p>

                  <div className="flex justify-between">
                    
                    <Button  className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50  ml-auto ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Unread">
            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <Users className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Invitation</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                        <Badge className=" bg-destructive text-destructive-foreground">
                          HIGH
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">
                      Project:{" "}
                    </span>
                    <span className="text-sm font-medium">
                      AI-Powered Student Assistant
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Building an intelligent chatbot system to help students with
                    course selection, scheduling, and academic planning using
                    natural language processing.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className=" gap-1 ">
                      {" "}
                      <UserCheck className="size-3 mr-1" />
                      Frontend Developer
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      React
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground">
                      TypeScript
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className="bg-success hover:bg-success/90 py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5">
                        <CircleCheck className="size-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="py-0 text-foreground h-8 px-3 has-[>svg]:px-2.5 gap-1.5"
                      >
                        <CircleX className="size-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Message</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      From:{" "}
                    </span>
                    <span className="text-sm font-medium"> Alex Chen</span>
                    <Badge variant="outline" className=" gap-1 ">
                      Team Lead
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Hey team! Just uploaded the latest UI mockups to the shared
                    drive. Please review them before our meeting tomorrow.
                  </p>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-1.5">
                        <Eye className="size-4 mr-1" />
                        View Message
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <CircleCheck className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Task Deadline</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">2h ago</span>
                  </div>
               <div className="mb-2 flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">Task: </span>
                  <span className="text-sm font-medium"> Complete Database Schema Design</span>
                      
               </div>
                   <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Due in 2 days
                    </Badge>
                  </div>

               <div className="flex justify-between">
               <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-0">
                <Eye className="size-4 mr-1"/>
                View Task
               </Button>
                <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                  <Trash2 className="size-4"/>
                </Button>
               </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Read">
          
            <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Team Message</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2h ago
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      From:{" "}
                    </span>
                    <span className="text-sm font-medium"> Alex Chen</span>
                    <Badge variant="outline" className=" gap-1 ">
                      Team Lead
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    Hey team! Just uploaded the latest UI mockups to the shared
                    drive. Please review them before our meeting tomorrow.
                  </p>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-1.5">
                        <Eye className="size-4 mr-1" />
                        View Message
                      </Button>
                    </div>
                    <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  <Card className="p-0 border-primary/30 bg-primary/5">
              <CardContent className="p-5 pb-6 gap-4 flex ">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <CircleCheck className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>Task Deadline</h4>
                        <Badge className="dark:bg-destructive/60 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">2h ago</span>
                  </div>
               <div className="mb-2 flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">Task: </span>
                  <span className="text-sm font-medium"> Complete Database Schema Design</span>
                      
               </div>
                   <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Due in 2 days
                    </Badge>
                  </div>

               <div className="flex justify-between">
               <Button className=" py-0 h-8 px-3 has-[>svg]:px-2.5 gap-1.5 mt-0">
                <Eye className="size-4 mr-1"/>
                View Task
               </Button>
                <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                  <Trash2 className="size-4"/>
                </Button>
               </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
