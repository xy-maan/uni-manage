import { GetStudentDataAction } from "@/Actions/getStudentData.action";
import EditProfileBtn from "@/app/[locale]/_Components/ProfileComponents/EditProfileBtn/EditProfileBtn";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { Award, Check, ExternalLink, GraduationCap, Mail, Phone, Pin, Plus, Star, Trophy } from "lucide-react";
 export const metadata: Metadata = {
   title: "Profile",
 };
export default async function profile() {
  const { payload: data } = await GetStudentDataAction();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border mb-8 ">
        <div className="pb-6 p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="  rounded-full h-32 w-32 border-4 border-primary/20 overflow-hidden  text-white">
              <span className="bg-linear-to-br size-full from-primary to-secondary rounded-full text-3xl flex items-center justify-center">
                {data?.user?.first_name.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            <div className="content flex-1 w-full">
              <div className="flex-col flex-1 ">
                <div className=" w-full flex items-center justify-between lg:mb-2 mb-4 lg:items-start">
                  <h3 className="lg:mb-2 text-[16px]">
                    {data.user.first_name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="justify-center rounded-md border w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-primary/90 bg-success/10 text-success border-success/30 text-sm px-2.5 py-1 flex items-center gap-1.5 cursor-help font-medium ">
                    <Award className="size-4"/>
                   
                      Top 10%
                    </span>
                    <EditProfileBtn />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary">
                  <GraduationCap className="size-3 mr-1"/>
                
                    {data.major}
                  </Badge>
                  <Badge className="bg-secondary/10 text-secondary">
                    {data.academic_level}
                  </Badge>
                  <Badge className="bg-success/10 text-success">
                  <Star className="size-3 mr-1"/>
                 
                    GPA: {data.gpa}
                  </Badge>
                </div>

                <div className="lg:w-[89%] w-full mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full ">
                        <Field className="w-full gap-2">
                          <FieldLabel htmlFor="progress-upload" className="">
                            <span className="text-muted-foreground font-medium">
                              Performance Score
                            </span>
                            <span className="ml-auto font-bold">88/100</span>
                          </FieldLabel>
                          <Progress
                            value={66}
                            id="progress-upload"
                            className="bg-muted  [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                          />
                        </Field>
                      </TooltipTrigger>

                      <TooltipContent className="text-sm space-y-1 bg-primary text-foreground [&_svg]:fill-primary [&_svg]:translate-y-[calc(-42%)] [&_svg]:bg-primary [&_svg]:size-3">
                        <h3 className="font-semibold">Score Calculation</h3>
                        <p>• Project completion rate</p>
                        <p>• Collaboration quality</p>
                        <p>• Feedback from supervisors</p>
                        <p>• Activity and engagement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-muted-foreground mb-4">
                  Passionate software engineer with a focus on full-stack
                  development and cloud technologies. Love building scalable
                  applications that solve real-world problems.
                </p>
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <Mail className=" size-4 text-muted-foreground"/>
                 
                    {data.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <Phone className="size-4 text-muted-foreground"/>
                   
                    +20 123 456 7890
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <Pin className="size-4 text-muted-foreground"/>
                   
                    Fayoum, Egypt
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="Projects">My Projects</TabsTrigger>
          <TabsTrigger value="Skills">Skills & Certifications</TabsTrigger>
          <TabsTrigger value="Achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Skills</span>
                  <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9">
                  <Plus className="size-4"/>
                  
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {data.skills.map((skill) => (
                  <Badge className=" bg-secondary text-secondary-foreground capitalize">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="border hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <span className="text-2xl font-bold text-primary">2</span>
                  <h3 className="text-sm text-muted-foreground">Projects</h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                  <span className="text-2xl font-bold text-secondary">8</span>
                  <h3 className="text-sm text-muted-foreground">Skills</h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/5 hover:bg-success/10 transition-colors">
                  <span className="text-2xl font-bold text-success">2</span>
                  <h3 className="text-sm text-muted-foreground">
                    Certificates
                  </h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/5 hover:bg-warning/10 transition-colors">
                  <span className="text-2xl font-bold text-warning">3</span>
                  <h3 className="text-sm text-muted-foreground">
                    Achievements
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border hover:border-primary/50 transition-all p-0">
              <CardHeader className="gap-1.5 px-6 pt-6">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Interests</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm px-6 pb-6 flex items-center flex-wrap gap-3">
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill) => (
                    <div className="  capitalize px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all">
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
                <Button className="px-4 py-2 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all bg-transparent">
                <Plus className="size-4 mx-auto text-muted-foreground"/>
               
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="Projects">
      <div className="space-y-4">
            <Card className="border hover:border-primary/50 transition-all gap-0  p-6">
            <CardHeader className="gap-0 p-0 ">
              <CardTitle className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 ">
                  <h4 className="text-md">AI-Powered Study Assistant</h4>
                  <Badge className=" bg-primary/10 text-primary border-primary/20">
            
                <Check className="size-3 mr-1"/>
                In Progress
</Badge>
              </div>
              <Button className="bg-transparent">
             
              <ExternalLink className="size-4"/>
</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0" >
        <p className=" text-sm text-muted-foreground mb-3">Role: Team Lead</p>
          {data.skills.map((skill) => (
                  <Badge className=" bg-secondary text-secondary-foreground capitalize">
                    {skill}
                  </Badge>
                ))}
            </CardContent>
          </Card>
             <Card className="border hover:border-primary/50 transition-all gap-0  p-6">
            <CardHeader className="gap-0 p-0 ">
              <CardTitle className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                  <h4 className="text-md">AI-Powered Study Assistant</h4>
                  <Badge className=" bg-primary/10 text-primary border-primary/20">
              
                <Check className="mr-1 size-3"/>
                In Progress
</Badge>
              </div>
              <Button className="bg-transparent">
               
                <ExternalLink className=" size-4"/>

</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0" >
        <p className=" text-sm text-muted-foreground mb-3">Role: Team Lead</p>
          {data.skills.map((skill) => (
                  <Badge className=" bg-secondary text-secondary-foreground capitalize">
                    {skill}
                  </Badge>
                ))}
            </CardContent>
          </Card>
      </div>
        </TabsContent>
        <TabsContent value="Skills">
   <Card className="border hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Certifications</span>
                  <Button className=" border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                   <Plus className="size-4"/>
                    Add Certificate
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
              <div className="space-y-3">
                  <div className="p-4 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex justify-between items-start">
                 <div className="">
                   <h3>AWS Certified Developer</h3>
                  <p className="text-sm text-muted-foreground">Amazon Web Services</p>
                 </div>

                   <Badge className=" bg-secondary text-secondary-foreground capitalize">
                   2025
                  </Badge>
                  </div>
                  </div>
                   <div className="p-4 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex justify-between items-start">
                 <div className="">
                   <h3>AWS Certified Developer</h3>
                  <p className="text-sm text-muted-foreground">Amazon Web Services</p>
                 </div>

                   <Badge className=" bg-secondary text-secondary-foreground capitalize">
                   2025
                  </Badge>
                  </div>
                  </div>
              </div>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="Achievements">
       <div className="grid md:grid-cols-2 gap-4">
           <Card className="hover:shadow-md hover:scale-105 duration-500 transition-all cursor-pointer">
            <CardContent className="">
             <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="size-6 text-primary"/>
          

              </div>
            <div className="">
                <h4 className="mb-1">Dean's List</h4>
              <p className="text-sm text-muted-foreground">Dean's List
Fall 2024, Spring 2025</p>
            </div>
             </div>
            </CardContent>
          </Card>
             <Card className="hover:shadow-md hover:scale-105 duration-500  transition-all cursor-pointer">
         <CardContent className="">
             <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="text-primary size-6"/>

         

              </div>
            <div className="">
                <h4 className="mb-1">Dean's List</h4>
              <p className="text-sm text-muted-foreground">Dean's List
Fall 2024, Spring 2025</p>
            </div>
             </div>
            </CardContent>
          </Card>
             <Card className="hover:shadow-md hover:scale-105 duration-500  transition-all cursor-pointer">
                 <CardContent className="">
             <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
           
            <Trophy className="size-6 text-primary"/>

              </div>
            <div className="">
                <h4 className="mb-1">Dean's List</h4>
              <p className="text-sm text-muted-foreground">Dean's List
Fall 2024, Spring 2025</p>
            </div>
             </div>
            </CardContent>
          </Card>
       </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
