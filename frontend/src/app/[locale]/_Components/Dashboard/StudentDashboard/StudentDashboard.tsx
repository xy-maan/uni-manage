import React from "react";
import ProjectCard from "../../ProjectCard/ProjectCard";
import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from '@/i18n/navigation';
import TasksDashboardStudent from "./TasksDashboardStudent";
import HeaderDashboard from "../HeaderDashboard";
import CardsInfoDashboard from "../CardsInfoDashboard";
import ReviewDashboard from "../ReviewDashboard";
import QuickAction from "../QuickAction";

export default function StudentDashboard() {
  return (
    <div>
     <HeaderDashboard variant="student"/>
 <ProjectCard
        activeBar="student"
        title="AI-Powered Study Assistant"
        subtitle="Supervised by Dr. Abdulrahman"
        topCard={false}
        isSkills={false}
        isDetails={false}
        variant="dashboard"
      />
   <CardsInfoDashboard  variant="student"/>
      <div className="gap-8 grid lg:grid-cols-3 ">
        <div className="upcoming lg:col-span-2">
          <Card className="p-0 ">
            <CardHeader className=" px-6 pt-6  gap-1.5">
                <div className=" flex items-center justify-between">

                      <div className="flex flex-col">
                <h4 className="leading-none font-medium">Upcoming Tasks</h4>
                <p className="text-muted-foreground">
                  Your assigned tasks for this week
                </p>
              </div>
              <Button className="bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9">View All</Button>
                </div>
            
            </CardHeader>
            <CardContent className="pb-6 px-6">
                    <div className="space-y-4 ">
       <TasksDashboardStudent/>
       <TasksDashboardStudent/>
</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
         <ReviewDashboard variant="student"/>
           
               <Card className="p-0">
                <CardHeader className="px-6 pt-6 gap-1.5">
                    <h4 className="leading-none">Quick Actions
</h4>
                </CardHeader>
                <CardContent className="pb-6 px-6">
<QuickAction variant="student"/>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
