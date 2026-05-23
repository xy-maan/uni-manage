"use client";
import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  activeBar: string;
  variant: string;
  title?: string;
  subtitle?: string;
  topCard?: boolean;
  isSkills?: boolean;
  isDetails?: boolean;
};
export default function ProjectCard({
  activeBar = "",
  title = "",
  variant = "",
  subtitle = "",
  topCard = true,
  isSkills = true,
  isDetails = true,
}: ProjectCardProps) {
  return (
    <div
      className={`card-project  text-card-foreground rounded-xl flex flex-col  mb-8 border-2 border-primary/20 relative h-full ${variant == "home" ? "bg-card gap-6  group transition-all duration-300 hover:border-primary/30 shadow-md hover:shadow-xl hover:scale-[1.02]" : "bg-linear-to-br from-primary/5 to-secondary/5"}`}
    >
      <div
        className={`flex flex-col ${variant == "dashboard" && "gap-4"}  p-6 `}
      >
        {topCard && (
          <div className="flex items-center justify-start mb-4 h-6 gap-2 flex-wrap ">
            <span className="[a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-500/10 text-green-500 border-green-500/20 border transition-all hover:scale-105  rounded-md px-2 py-0.5 text-xs font-medium w-fi">
              AI/ML
            </span>
            <span className="[a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-500/10 text-green-500 border-green-500/20 border transition-all hover:scale-105  rounded-md px-2 py-0.5 text-xs font-medium w-fi">
              Active
            </span>
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="">
            <h3
              className={` ${variant == "home" ? "mb-2 text-xl group-hover:text-primary transition-colors line-clamp-1" : "leading-none "} `}
            >
              {title}
            </h3>
            <p
              className={`${variant == "home" && "text-sm"} text-muted-foreground mb-4 line-clamp-2`}
            >
              {subtitle}
            </p>
          </div>
          {variant == "dashboard" && (
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit hover:bg-primary/90 bg-primary text-white">
              Development
            </span>
          )}
        </div>
        {/* from api */}
        {isSkills && (
          <div className="skills items-center justify-start flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">
              Python
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">
              Python
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">
              Python
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">
              Python
            </span>
          </div>
        )}
        {isDetails && (
          <div className="details-project flex  items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users size-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              4 members
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-clock size-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              8 months
            </span>
          </div>
        )}
        <div className="progress">
          <Field className="w-full gap-0">
            <FieldLabel
              htmlFor="progress-upload"
              className=" text-xs text-muted-foreground mb-2"
            >
              <span
                className={`${variant == "home" ? "text-xs text-muted-foreground" : "text-sm text-foreground"} font-medium `}
              >
                Project Progress
              </span>
              <span className="ml-auto">75%</span>
            </FieldLabel>
            <Progress
              value={75}
              id="progress-upload"
              className={`${variant == "dashboard" ? "h-3 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none" : ""} overflow-hidden`}
            />
          </Field>
        </div>
      </div>
      {variant == "home" && (
        <div className="card-footer mt-3 p-6 py-0 w-full">
          {activeBar == "student" && (
           
           <Button className="text-center border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye size-4 mr-2"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Details
            </Button>
          )}
          {activeBar == "supervisor" && (
            <Button className="text-center border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up size-4 mr-2"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              Monitor Progress
            </Button>
          )}
          {/*  */}
        </div>
      )}
      {variant == "dashboard" && (
        <div className="card-footer px-6 pb-6 flex items-center justify-between ">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar size-4"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            <span>Due: Apr 30, 2026</span>
          </div>
          <Button>
            View Project{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right ml-2 size-4"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Button>
        </div>
      )}
    </div>
 
  );
}
