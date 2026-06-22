"use client";
import React from 'react'
import {
  Award, GraduationCap, Star, Users, Mail, Github, Linkedin, Plus
} from 'lucide-react'
import EditProfileBtn from "@/app/[locale]/_Components/ProfileComponents/EditProfileBtn/EditProfileBtn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Link } from '@/i18n/navigation';

export default function StudentProfile({ dataStudent }: { dataStudent: any }) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header Card */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border mb-8">
        <div className="pb-6 p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="rounded-full h-32 w-32 border-4 border-primary/20 overflow-hidden text-white">
              <span className="bg-linear-to-br size-full from-primary to-secondary rounded-full text-3xl flex items-center justify-center">
                {dataStudent?.user?.first_name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            <div className="content flex-1 w-full">
              <div className="flex-col flex-1">
                <div className="w-full flex items-center justify-between lg:mb-2 mb-4 lg:items-start">
                  <h3 className="lg:mb-2 text-[16px]">
                    {dataStudent.user.first_name} {dataStudent.user.last_name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {dataStudent.gpa >= 3.5 && (
                      <span className="justify-center rounded-md border w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-primary/90 bg-success/10 text-success border-success/30 text-sm px-2.5 py-1 flex items-center gap-1.5 cursor-help font-medium">
                        <Award className="size-4" />
                        Top 10%
                      </span>
                    )}
                    <EditProfileBtn />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary">
                    <GraduationCap className="size-3 mr-1" />
                    {dataStudent.user.role}
                  </Badge>
                  <Badge className="bg-secondary/10 text-secondary">
                    {dataStudent.academic_level?.name}
                  </Badge>
                  <Badge className="bg-success/10 text-success">
                    <Star className="size-3 mr-1" />
                    GPA: {dataStudent.gpa}
                  </Badge>
                  {dataStudent.student_id && (
                    <Badge className="bg-muted text-muted-foreground">
                      ID: {dataStudent.student_id}
                    </Badge>
                  )}
                </div>

                <div className="lg:w-[89%] w-full mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <Field className="w-full gap-2">
                          <FieldLabel htmlFor="progress-upload">
                            <span className="text-muted-foreground font-medium">
                              Performance Score
                            </span>
                            <span className="ml-auto font-bold">
                              {Math.round((dataStudent.gpa / 4) * 100)}/100
                            </span>
                          </FieldLabel>
                          <Progress
                            value={(dataStudent.gpa / 4) * 100}
                            id="progress-upload"
                            className="bg-muted [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
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

                <div className="flex flex-wrap gap-2 mb-4">
                  {dataStudent.looking_for_course_project_team && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="size-3 mr-1" />
                      Looking for Course Team
                    </Badge>
                  )}
                  {dataStudent.looking_for_grad_project_team && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="size-3 mr-1" />
                      Looking for Graduation Team
                    </Badge>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer">
                    <Mail className="size-4 text-muted-foreground" />
                    {dataStudent.user.email}
                  </div>
                  {dataStudent.github_url && (
                    <Link
                      href={dataStudent.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer"
                    >
                      <Github className="size-4 text-muted-foreground" />
                      GitHub
                    </Link>
                  )}
                  {dataStudent.linkedin_url && (
                    <Link
                      href={dataStudent.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer"
                    >
                      <Linkedin className="size-4 text-muted-foreground" />
                      LinkedIn
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="Projects">My Projects</TabsTrigger>
          <TabsTrigger value="Skills">Skills & Certifications</TabsTrigger>
          <TabsTrigger value="Achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Skills</span>
                  <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9">
                    <Plus className="size-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex flex-wrap gap-2">
                {dataStudent.skills?.map((skill: any) => (
                  <Badge key={skill.id} className="bg-secondary text-secondary-foreground capitalize">
                    {skill.name}
                  </Badge>
                ))}
                {dataStudent.skills?.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
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
                  <span className="text-2xl font-bold text-primary">
                    {dataStudent.projects_count ?? 0}
                  </span>
                  <h3 className="text-sm text-muted-foreground">Projects</h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                  <span className="text-2xl font-bold text-secondary">
                    {dataStudent.skills?.length ?? 0}
                  </span>
                  <h3 className="text-sm text-muted-foreground">Skills</h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/5 hover:bg-success/10 transition-colors">
                  <span className="text-2xl font-bold text-success">
                    {dataStudent.certificates_count ?? 0}
                  </span>
                  <h3 className="text-sm text-muted-foreground">Certificates</h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/5 hover:bg-warning/10 transition-colors">
                  <span className="text-2xl font-bold text-warning">
                    {dataStudent.achievements_count ?? 0}
                  </span>
                  <h3 className="text-sm text-muted-foreground">Achievements</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/50 transition-all p-0">
              <CardHeader className="gap-1.5 px-6 pt-6">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-normal">Department</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm px-6 pb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border w-fit">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{dataStudent.department?.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="Projects">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-12">
              No projects to display yet.
            </p>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="Skills">
          <Card className="border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-md font-normal">Skills</span>
                <Button className="border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                  <Plus className="size-4" />
                  Add Skill
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {dataStudent.skills?.map((skill: any) => (
                <div
                  key={skill.id}
                  className="capitalize px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="Achievements">
          <div className="grid md:grid-cols-2 gap-4">
            <p className="text-sm text-muted-foreground text-center py-12 col-span-2">
              No achievements to display yet.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}