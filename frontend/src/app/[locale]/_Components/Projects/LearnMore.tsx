import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  Info,
  InfoIcon,
  LayoutGrid,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function LearnMore({ variant }: { variant: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-xs gap-1.5 px-3 py-0 h-8"
        >
          <Info className="mr-2 size-3" />
          Learn more
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]  max-h-[90vh] block overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="">
            <div className=" font-semibold flex items-center gap-3 mb-2 ">
              <div
                className={`size-12 rounded-lg flex items-center justify-center ${variant == "agile" && "bg-primary/10  text-primary"} ${variant == "waterfall" && "bg-secondary/10  text-secondary"} ${variant == "kanban" && "bg-success/10  text-success"}`}
              >
                {variant == "agile" && <Zap className="size-6" />}
                {variant == "waterfall" && <Target />}
                {variant == "kanban" && <LayoutGrid className="size-6" />}
              </div>

              <div className="">
                <h4 className="text-lg leading-none font-semibold">
                  {variant == "agile" && "Sprint-Based"}{" "}
                  {variant == "waterfall" && "Milestone-Based"}{" "}
                  {variant == "kanban" && "Flexible Board"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {variant == "agile" && "Agile-Inspired"}{" "}
                  {variant == "waterfall" && "Waterfall-Inspired"}{" "}
                  {variant == "kanban" && "Kanban-Inspired"}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mb-6">
          <h5 className="mb-2">Overview</h5>
          <p className="text-muted-foreground text-sm">
            {variant == "agile" &&
              "Sprint-based methodology breaks your project into fixed time periods called sprints. Each sprint focuses on delivering a working increment of your project. This approach emphasizes collaboration, quick iterations, and adapting to change. Perfect for teams that want to deliver value early and often while staying flexible to new requirements."}
            {variant == "waterfall" &&
              "  Milestone-based methodology follows a structured, sequential approach where each phase must be completed before moving to the next. Your project is divided into major milestones with specific deliverables. This provides clear structure and predictability, ideal for projects with well-defined requirements and formal academic evaluation criteria."}
            {variant == "kanban" &&
              "Flexible Board (Kanban) methodology provides a visual way to manage work as it moves through different stages. Tasks flow continuously through your board based on capacity and priority. This approach offers maximum flexibility with minimal process overhead, perfect for teams that want to stay nimble and focus on completing work rather than planning iterations."}
          </p>
        </div>
        <div className="mb-6">
          <h5 className="mb-3">Key Features</h5>
          <ul>
            {variant === "agile" && (
              <>
                {[
                  "Time-boxed sprints (1-4 weeks)",
                  "Sprint planning & retrospectives",
                  "Daily stand-ups",
                  "Incremental delivery",
                  "Continuous feedback",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <CircleCheck className="size-4 mt-0.5 text-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}

            {variant === "waterfall" && (
              <>
                {[
                  "Sequential phases",
                  "Clear milestone checkpoints",
                  "Comprehensive planning",
                  "Phase-gate reviews",
                  "Detailed documentation",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <CircleCheck className="size-4 mt-0.5 text-secondary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}

            {variant === "kanban" && (
              <>
                {[
                  "Visual workflow board",
                  "Work-in-progress limits",
                  "Continuous flow",
                  "Pull-based system",
                  "Real-time priorities",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <CircleCheck className="size-4 mt-0.5 text-success" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h5 className="mb-3">Best For</h5>
          <ul className="">
            {variant === "agile" && (
              <>
                {[
                  "Projects with evolving requirements",
                  "Teams that value flexibility",
                  "Iterative development",
                  "Regular client feedback",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <TrendingUp className="size-4 text-primary mt-0.5 " />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}

            {variant === "waterfall" && (
              <>
                {[
                  "Well-defined requirements",
                  "Predictable timelines",
                  "Structured academic projects",
                  "Formal evaluation processes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <TrendingUp className="size-4 text-secondary mt-0.5 " />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}

            {variant === "kanban" && (
              <>
                {[
                  "Continuous delivery",
                  "Flexible priorities",
                  "Visual task management",
                  "Teams wanting simplicity",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 mb-2">
                    <TrendingUp className="size-4 text-success mt-0.5 " />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
        <Card
          className={`text-card-foreground flex flex-col gap-6 p-0  ${variant == "agile" && "bg-primary/5 border-text-primary/20 "} ${variant == "waterfall" && "bg-secondary/5 border-text-secbg-secondary/20 "} ${variant == "kanban" && "bg-success/5 border-text-success/20 "}`}
        >
          <CardContent className=" p-4 pb-6">
            <div className=" flex items-start gap-3">
              <Info
                className={`size-5 mt-0 ${variant == "agile" && "text-primary"} ${variant == "waterfall" && "text-secondary"} ${variant == "kanban" && "text-success"}
        `}
              />
              <div className="">
                <h4 className="text-sm font-medium mb-1">
                  Dashboard Configuration
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your project dashboard will be automatically configured with
                  the appropriate tools, task boards, and tracking features for
                  this methodology.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3 pt-4 ml-auto">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Back To Selection
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
