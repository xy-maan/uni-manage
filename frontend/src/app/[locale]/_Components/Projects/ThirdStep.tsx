"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheck, Info, LayoutGrid, Target, Zap } from "lucide-react";
import LearnMore from "./LearnMore";

export default function ThirdStep() {
  const [typeMethd, setTypeMethd] = useState("");
  return (
    <div className="grid md:grid-cols-2 gap-4 ">
      <div
        className={`relative p-6 rounded-lg border-2 transition-all text-left ${typeMethd == "agile" ? "border-primary/20 bg-primary/5 " : "border-border hover:border-primary/50 hover:bg-muted/50"}  `}
        onClick={() => {
          setTypeMethd("agile");
        }}
      >
        <div className="flex flex-col items-start space-y-3">
          <div
            className={`size-12 rounded-lg flex items-center justify-center bg-primary/10  text-primary`}
          >
            <Zap className="size-6" />
          </div>
          <div className="flex flex-col items-start ">
            <h4 className="mb-1">Sprint-Based</h4>
            <Badge className="bg-primary/10 text-primary mb-2">
              Agile-Inspired
            </Badge>
            <p className="text-sm text-muted-foreground">
              Work in focused time-boxed sprints with regular reviews and
              adaptations.
            </p>
          </div>
          <LearnMore variant="agile" />
        </div>
        {typeMethd == "agile" && (
          <CircleCheck className="size-5 text-primary absolute top-4 right-4" />
        )}
      </div>
      <div
        className={`relative p-6 rounded-lg border-2 transition-all text-left ${typeMethd == "waterfall" ? "border-secondary/20 bg-secondary/5 " : "border-border hover:border-scbg-secondary/50 hover:bg-muted/50"}  `}
        onClick={() => {
          setTypeMethd("waterfall");
        }}
      >
        <div className="flex flex-col items-start space-y-3">
          <div
            className={`size-12 rounded-lg flex items-center justify-center bg-secondary/10  text-secondary`}
          >
            <Target className="size-6"/>
            </div>
          <div className="flex flex-col items-start  ">
            <h4 className="mb-1">Milestone-Based</h4>
            <Badge className="bg-secondary/10 text-secondary mb-2">
              Waterfall-Inspired
            </Badge>
            <p className="text-sm text-muted-foreground">
              Progress through sequential phases with clear milestones and
              deliverables.
            </p>
          </div>
             <LearnMore variant="waterfall" />
          {/* <Button
            variant="ghost"
            className="w-full justify-start text-xs gap-1.5 px-3 py-0 h-8"
          >
            <Info className="mr-2 h-3 w-3" />
            Learn more
          </Button> */}
      </div>
        {typeMethd == "waterfall" && (
          <CircleCheck className="size-5 text-secondary absolute top-4 right-4" />
        )}
      </div>
      <div
        className={`relative p-6 rounded-lg border-2 transition-all text-left ${typeMethd == "kanban" ? "border-success/20 bg-success/5 " : "border-border hover:border-success/50 hover:bg-muted/50"}  `}
        onClick={() => {
          setTypeMethd("kanban");
        }}
      >
        <div className="flex flex-col items-start space-y-3">
          <div
            className={`size-12 rounded-lg flex items-center justify-center bg-success/10  text-success`}
          >
            <LayoutGrid className="size-6" />
          </div>
          <div className="flex flex-col items-start ">
            <h4 className="mb-1">Flexible Board</h4>
            <Badge className="bg-success/10 text-success mb-2">
              Kanban-Inspired
            </Badge>
            <p className="text-sm text-muted-foreground">
              Visualize workflow and optimize flow with a flexible task board.
            </p>
          </div>
             <LearnMore variant="kanban" />
       
        </div>
        {typeMethd == "kanban" && (
          <CircleCheck className="size-5 text-success absolute top-4 right-4" />
        )}
      </div>
    </div>
  );
}
