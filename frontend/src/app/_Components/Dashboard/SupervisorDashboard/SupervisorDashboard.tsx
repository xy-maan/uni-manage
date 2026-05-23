import React from "react";
import ProjectCard from "../../ProjectCard/ProjectCard";
import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import HeaderDashboard from "../HeaderDashboard";
import TasksDashboardStudent from "../StudentDashboard/TasksDashboardStudent";
import CardsInfoDashboard from "../CardsInfoDashboard";
import TasksDashboardSupervisor from "./TasksDashboardSupervisor";
import ReviewDashboard from "../ReviewDashboard";
import QuickAction from "../QuickAction";

export default function SupervisorDashboard() {
  return (
    <div>
     <HeaderDashboard variant="supervisor"/>
  <CardsInfoDashboard variant="supervisor"/>

      <div className="gap-8 grid lg:grid-cols-3 ">
        <div className="upcoming lg:col-span-2">
          <Card className="p-0 ">
            <CardHeader className=" px-6 pt-6  gap-1.5">
                <div className=" flex items-center justify-between">

                      <div className="flex flex-col">
                <h4 className="leading-none font-medium">Supervised Projects</h4>
                <p className="text-muted-foreground">
                 Overview of all your current projects
                </p>
              </div>
              <Button className="bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9">View All</Button>
                </div>
            
            </CardHeader>
            <CardContent className="pb-6 px-6">
                      <div className="space-y-4 ">
       <TasksDashboardSupervisor/>
       <TasksDashboardSupervisor/>
       <TasksDashboardSupervisor/>
       <TasksDashboardSupervisor/>
                        </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
       <ReviewDashboard variant="supervisor"/>
               <Card className="p-0">
                <CardHeader className="px-6 pt-6 gap-1.5">
                    <h4 className="leading-none">Quick Actions
</h4>
                </CardHeader>
                <CardContent className="pb-6 px-6">

                   <QuickAction variant="supervisor"/>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
