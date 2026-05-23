import React from "react";
import HeaderMeth from "../../HeaderMeth";
import CardMeth from "../../CardMeth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  ChevronRight,
  Circle,
  CircleCheck,
  Clock,
  FileText,
  FileTextIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MilestoneCard from "../MilestoneCard";
import { Button } from "@/components/ui/button";
export default function MilestonePage() {
  return (
    <div>
      <HeaderMeth variant="milestone" />
      <CardMeth variant="milestone" />

      <Card className="my-6 p-0">
        <CardHeader className="px-6 pt-6 flex items-start flex-col">
          <h3 className="leading-none">Milestone Timeline</h3>
          <p className="text-muted-foreground">
            Sequential project phases with gate reviews
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {/* phase 1 */}
          <div className="flex relative flex-col lg:flex-row lg:gap-6 gap-4 mb-6 rounded-lg border-2 p-6 border-success/30 bg-success/5">
            <div className="absolute left-5.1 top-15 -bottom-6 w-px bg-border lg:block hidden"></div>
            <div className="left-card left-card flex flex-row   gap-4 lg:min-w-75">
              <div className="shrink-0 size-12 rounded-full flex items-center justify-center dark:bg-success bg-success/50">
                <CircleCheck className=" size-5 text-foreground" />
              </div>
              <div className="">
                <Badge className="text-foreground bg-transparent border-border mb-2">
                  Phase 1
                </Badge>
                <h3 className="mb-1">Project Proposal & Requirements</h3>
                <Badge className="text-success bg-success/10 border-success/20">
                  Completed
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Calendar className="size-4" />
                  Due: Dec 20, 2025
                </div>
                <div className="flex items-center gap-2 text-success  text-sm">
                  <CircleCheck className="size-4 " />
                  Completed: Dec 18, 2025
                </div>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Users className="size-4" />4 team members
                </div>
              </div>
            </div>
            <div className="right-card flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deliverables</span>
                <Badge className=" border-transparent bg-secondary text-secondary-foreground">
                  3/3
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Project Proposal Document
                </h5>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Requirements Specification
                </h5>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 ">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Team Formation
                </h5>
              </div>
            </div>
          </div>
          {/* phase 2 */}
          <div className="flex relative flex-col lg:flex-row lg:gap-6 gap-4 mb-6 rounded-lg border-2 p-6 border-success/30 bg-success/5">
            <div className="absolute left-5.1 top-15 -bottom-6 w-px bg-border  lg:block hidden"></div>
            <div className="left-card left-card flex flex-row   gap-4 lg:min-w-75">
              <div className="shrink-0 size-12 rounded-full flex items-center justify-center dark:bg-success bg-success/50">
                <CircleCheck className=" size-5 " />
              </div>
              <div className="">
                <Badge className="text-foreground bg-transparent border-border mb-2">
                  Phase 2
                </Badge>
                <h3 className="mb-1">System Design & Architecture</h3>
                <Badge className="text-success bg-success/10 border-success/20">
                  Completed
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Calendar className="size-4" />
                  Due: Dec 20, 2025
                </div>
                <div className="flex items-center gap-2 text-success  text-sm">
                  <CircleCheck className="size-4 " />
                  Completed: Dec 18, 2025
                </div>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Users className="size-4" />4 team members
                </div>
              </div>
            </div>
            <div className="right-card flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deliverables</span>
                <Badge className=" border-transparent bg-secondary text-secondary-foreground">
                  3/3
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  System Architecture Document
                </h5>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Database Schema Design
                </h5>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 ">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  UI/UX Mockups
                </h5>
              </div>
            </div>
          </div>
          {/* phase 3 */}
          <div className="flex relative flex-col lg:flex-row lg:gap-6 gap-4 mb-6 rounded-lg border-2 p-6 border-primary bg-primary/5">
            <div className="absolute left-5.1 top-15 -bottom-6 w-px bg-border  lg:block hidden"></div>
            <div className="left-card left-card flex flex-row   gap-4 lg:min-w-75 ">
              <div className="shrink-0 size-12 rounded-full flex items-center justify-center bg-primary">
                <Clock className=" size-5 text-foreground" />
              </div>
              <div className="">
                <Badge className="text-foreground bg-transparent border-border mb-2">
                  Phase 3
                </Badge>
                <h3 className="mb-1">Implementation & Testing</h3>
                <Badge className="text-primary bg-primary/10 border-primary/20">
                  In Progress
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Calendar className="size-4" />
                  Due: Dec 20, 2025
                </div>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Users className="size-4" />4 team members
                </div>

                <div className="progress">
                  <Field className="w-full gap-0">
                    <FieldLabel
                      htmlFor="progress-upload"
                      className=" text-xs mb-2"
                    >
                      <span>Phase Progress</span>
                      <span className="ml-auto">65%</span>
                    </FieldLabel>
                    <Progress
                      value={75}
                      id="progress-upload"
                      className="h-1 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none overflow-hidden"
                    />
                  </Field>
                </div>
              </div>
            </div>
            <div className="right-card flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deliverables</span>
                <Badge className=" border-transparent bg-secondary text-secondary-foreground">
                  3/3
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 " />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Core Features Implementation
                </h5>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border  bg-success/5 border-success/20 my-2">
                <div className="size-5 rounded flex items-center justify-center dark:bg-success bg-success/50">
                  <CircleCheck className="size-4 text-foreground" />
                </div>
                <h5 className="text-sm flex-1 text-muted-foreground line-through">
                  Database Integration
                </h5>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 ">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    API Development
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 my-2">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    API Development
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
          {/* phase 4 */}
          <div className="flex relative flex-col lg:flex-row lg:gap-6 gap-4 mb-6 rounded-lg border-2 p-6 border-border">
            <div className="absolute left-5.1 top-15 -bottom-6 w-px bg-border  lg:block hidden"></div>
            <div className="left-card left-card flex flex-row   gap-4 lg:min-w-75 ">
              <div className="shrink-0 size-12 rounded-full flex items-center justify-center bg-muted">
                <Circle className=" size-5 text-muted-foreground" />
              </div>
              <div className="">
                <Badge className="text-foreground bg-transparent border-border mb-2">
                  Phase 4
                </Badge>
                <h3 className="mb-1">Quality Assurance & Refinement</h3>
                <Badge className="bg-muted text-muted-foreground border-border">
                  Upcoming
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Calendar className="size-4" />
                  Due: Dec 20, 2025
                </div>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Users className="size-4" />4 team members
                </div>
              </div>
            </div>
            <div className="right-card flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deliverables</span>
                <Badge className=" border-transparent bg-secondary text-secondary-foreground">
                  3/3
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 ">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    API Development
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 my-2">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    API Development
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
          {/* phase 5 */}
          <div className="flex  flex-col lg:flex-row lg:gap-6 gap-4 mb-6 rounded-lg border-2 p-6 border-border">
            <div className="left-card left-card flex flex-row   gap-4 lg:min-w-75 ">
              <div className="shrink-0 size-12 rounded-full flex items-center justify-center bg-muted">
                <Circle className=" size-5 text-muted-foreground" />
              </div>
              <div className="">
                <Badge className="text-foreground bg-transparent border-border mb-2">
                  Phase 5
                </Badge>
                <h3 className="mb-1">Final Delivery & Documentation</h3>
                <Badge className="bg-muted text-muted-foreground border-border">
                  Upcoming
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Calendar className="size-4" />
                  Due: Dec 20, 2025
                </div>
                <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
                  <Users className="size-4" />4 team members
                </div>
              </div>
            </div>
            <div className="right-card flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deliverables</span>
                <Badge className=" border-transparent bg-secondary text-secondary-foreground">
                  3/3
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 ">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    Final Documentation
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border  bg-background border-border hover:border-primary/50 my-2">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded flex items-center justify-center border-2 border-muted-foreground">
                    {/* <CircleCheck className='size-4 text-foreground'/> */}
                  </div>
                  <h5 className="text-sm flex-1 text-foreground ">
                    Deployment
                  </h5>
                </div>
                <Button className="py-0 bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground">
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="Footer-milestone">
        <Card className="border to-do p-0 gap-6 flex flex-col bg-card text-card-foreground  ">
          <CardHeader className="gap-1.5 px-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <h3>Next Steps</h3>
              </div>
              <Badge className="bg-primary/10 text-primary">
                Action Required
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="task transition-all cursor-pointer  px-6 pb-6 space-y-3">
            <div className="flex justify-between items-center  p-4 rounded-lg bg-primary/5 border border-primary/20 mb-3 ">
              <div className="flex justify-between items-start gap-3">
                <ChevronRight className="size-5 text-primary mt-0.75" />
                <div className="">
                  <h3 className="font-medium mb-1">Complete API Development</h3>
                  <p className="text-sm text-muted-foreground">
                    Finish remaining API endpoints to move forward with
                    integration testing
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center  p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex justify-between items-start gap-3">
                <ChevronRight className="size-5 text-primary mt-0.75" />
                <div className="">
                  <h3 className="font-medium mb-1">
                    Prepare for Testing Phase
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Begin planning test cases and scenarios for the upcoming QA
                    phase
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
