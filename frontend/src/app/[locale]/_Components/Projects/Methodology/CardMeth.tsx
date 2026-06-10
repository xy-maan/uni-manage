import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Flag,
  LayoutGrid,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";

export default function CardMeth({ variant }: { variant: string }) {
  return (
    <Card
      className={`text-card-foreground flex flex-col gap-6 rounded-xl border p-0 bg-gradient-to-br ${variant == "milestone" && " from-secondary/5 via-secondary/10 to-primary/5 border-secondary/20"} ${variant == "sprint" && "from-primary/5 via-primary/10 to-secondary/5 border-primary/20"} ${variant == "flexible" && "from-success/5 via-success/10 to-primary/5 border-success/20"} `}
    >
      <CardContent className="p-6">
        <div className="flex  justify-between lg:flex-row lg:items-center lg:flex-roe flex-col gap-6">
          <div className={`left-side ${variant == "milestone" && "flex-1"}`}>
            <div className="header flex items-center gap-3">
              <div
                className={`${variant == "sprint" && "bg-primary"} ${variant == "milestone" && "bg-secondary "} ${variant == "flexible" && "bg-success "} icon size-12 rounded-lg  flex items-center justify-center`}
              >
                {variant == "sprint" && <Zap className="size-6 text-white" />}
                {variant == "milestone" && (
                  <Target className="size-6 text-white" />
                )}
                {variant == "flexible" && (
                  <LayoutGrid className="size-6 text-white" />
                )}
              </div>
              <div className="content-icon">
                <Badge
                  className={`${variant == "sprint" && " bg-primary/20 text-primary "} ${variant == "milestone" && "bg-secondary/20 text-secondary"} ${variant == "flexible" && "bg-success/20 text-success"}  mb-1`}
                >
                  {variant == "sprint" && "Active Sprint"}
                  {variant == "milestone" && "Development  Phase"}
                  {variant == "flexible" && "Continuous Flow "}
                </Badge>
                <h2 className="text-xl font-semibold">
                  {variant == "sprint" && "Sprint 3: Core Features"}
                  {variant == "milestone" && "Project Milestone Timeline"}
                  {variant == "flexible" && "Flexible Task Board"}
                </h2>
              </div>
            </div>
            <div className="date-section flex flex-col lg:flex-row lg:items-center items-start lg:gap-4 gap-2 text-sm  my-3">
              <div className="date flex items-center gap-2">
                {variant == "flexible" ? (
                  <TrendingUp className="size-4 text-muted-foreground" />
                ) : (
                  <Calendar className="size-4 text-muted-foreground" />
                )}

                <span>
                  {variant == "sprint" && " Jan 20, 2026 - Feb 3, 2026"}
                  {variant == "milestone" && "Target Completion: May 15, 2026"}
                  {variant == "flexible" && "2 tasks completed"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {variant == "milestone" ? (
                  <Flag className="size-4 text-secondary" />
                ) : (
                  <Clock className="size-4 text-muted-foreground" />
                )}

                <span
                  className={` ${variant == "milestone" ? "" : "text-warning"} `}
                >
                  {variant == "sprint" && "7 days remaining"}{" "}
                  {variant == "milestone" && "2/5 milestones completed"}{" "}
                  {variant == "flexible" && "1 tasks need attention"}
                </span>
              </div>
            </div>
            {variant != "flexible" && (
              <div className="progress">
                <Field className="w-full gap-0">
                  <FieldLabel
                    htmlFor="progress-upload"
                    className=" text-xs mb-2"
                  >
                    <span>
                      {variant == "sprint"
                        ? " Sprint Progress"
                        : "Overall Project Progress"}
                    </span>
                    <span className="ml-auto">65%</span>
                  </FieldLabel>
                  <Progress
                    value={75}
                    id="progress-upload"
                    className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none overflow-hidden"
                  />
                </Field>
              </div>
            )}
          </div>
          <div className="right-side">
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-0">
                <CardContent className="text-center p-4 pb-6">
                  <p
                    className={`text-2xl font-bold ${variant == "sprint" && " text-primary"} ${variant == "milestone" && "text-secondary"} ${variant == "sprint" && "text-muted-foreground"}`}
                  >
                    {variant == "sprint" && "13/29"}{" "}
                    {variant == "milestone" && "2/5"}{" "}
                    {variant == "flexible" && "11"}{" "}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {variant == "sprint" && "Story Points"}{" "}
                    {variant == "milestone" && "Milestones"}{" "}
                    {variant == "flexible" && "Total"}{" "}
                  </p>
                </CardContent>
              </Card>
              <Card className="p-0">
                <CardContent className="text-center p-4 pb-6">
                  <p
                    className={`text-2xl font-bold ${variant == "sprint" && " text-secondary"} ${variant == "milestone" && "text-primary"} ${variant == "flexible" && "text-primary"}`}
                  >
                    {variant == "sprint" && "32"}{" "}
                    {variant == "milestone" && "9/20"}{" "}
                    {variant == "flexible" && "2"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {variant == "sprint" && "Velocity"}{" "}
                    {variant == "milestone" && "Deliverables"}{" "}
                    {variant == "flexible" && "Active"}
                  </p>
                </CardContent>
              </Card>
              {variant == "flexible" && (
                <Card className="p-0">
                  <CardContent className="text-center p-4 pb-6">
                    <p className="text-2xl font-bold text-success">2</p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
