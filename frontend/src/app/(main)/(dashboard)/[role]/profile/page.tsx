import { GetStudentDataAction } from "@/Actions/getStudentData.action";
import EditProfileBtn from "@/app/_Components/EditProfileBtn/EditProfileBtn";
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-award size-4"
                      >
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                        <circle cx={12} cy={8} r={6} />
                      </svg>
                      Top 10%
                    </span>
                    <EditProfileBtn />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-graduation-cap h-3 w-3 mr-1"
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                      <path d="M22 10v6" />
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                    </svg>
                    {data.major}
                  </Badge>
                  <Badge className="bg-secondary/10 text-secondary">
                    {data.academic_level}
                  </Badge>
                  <Badge className="bg-success/10 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star h-3 w-3 mr-1"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail size-4 text-muted-foreground"
                    >
                      <rect width={20} height={16} x={2} y={4} rx={2} />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {data.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-phone size-4 text-muted-foreground"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    +20 123 456 7890
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin size-4 text-muted-foreground"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx={12} cy={10} r={3} />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-plus size-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-plus size-4 mx-auto text-muted-foreground"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-3 w-3 mr-1"><circle cx={12} cy={12} r={10} /><path d="m9 12 2 2 4-4" /></svg>
                In Progress
</Badge>
              </div>
              <Button className="bg-transparent"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link size-4"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-3 w-3 mr-1"><circle cx={12} cy={12} r={10} /><path d="m9 12 2 2 4-4" /></svg>
                In Progress
</Badge>
              </div>
              <Button className="bg-transparent"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link size-4"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-plus size-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy size-6 text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>

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
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy size-6 text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>

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
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy size-6 text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>

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
