"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ProjectCard from "../../Projects/ProjectCard/ProjectCard";
import { ArrowRight, GraduationCap, UserCheck } from "lucide-react";
export default function BarHome() {
  const [activeBar, setActiveBar] = useState("student");
  return (
    <>
      <div className="bar flex items-center mb-12 justify-center gap-2 ">
        <div className="student-bar">
          <Button
            className={`flex items-center justify-between text-sm font-medium  rounded-md gap-1.5 px-3 pr-4 has-[>svg]:px-2.5 py-0 cursor-pointer border transition-all duration-200 transform-none  pb-0.75 ${
              activeBar == "student"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            }`}
            onClick={() => {
              setActiveBar("student");
            }}
          >
            <GraduationCap className=" size-4 mr-2"/>
       
            Student View
          </Button>
        </div>
        <div className="">
          <Button
            className={`flex items-center justify-between text-sm font-medium  rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 py-0 cursor-pointer  border transition-all duration-200 transform-none pb-0.75 pr-4 ${
              activeBar == "supervisor"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : " bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            }`}
            onClick={() => {
              setActiveBar("supervisor");
            }}
          >
            <UserCheck className=" size-4 mr-2"/>
         
            Supervisor View
          </Button>
        </div>
      </div>
      <div className="projects flex flex-col items-center">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* from api */}
          <ProjectCard
            activeBar={activeBar}
            title="AI-Powered Study Assistant"
            subtitle="An intelligent chatbot system designed to help students with course selection, academic planning, and university navigation."
            variant="home"
          />
          <ProjectCard
            activeBar={activeBar}
            title="AI-Powered Study Assistant"
            subtitle="An intelligent chatbot system designed to help students with course selection, academic planning, and university navigation."
            variant="home"
          />
          <ProjectCard
            activeBar={activeBar}
            title="AI-Powered Study Assistant"
            subtitle="An intelligent chatbot system designed to help students with course selection, academic planning, and university navigation."
            variant="home"
          />
          <ProjectCard
            activeBar={activeBar}
            title="AI-Powered Study Assistant"
            subtitle="An intelligent chatbot system designed to help students with course selection, academic planning, and university navigation."
            variant="home"
          />
        </div>
        <Button className="text-center flex  px-6 has-[>svg]:px-4 h-10 justify-center items-center w-fit">
          Explore All Projects
          <ArrowRight className=" ml-2 size-5"/>
        
        </Button>
      </div>
    </>
  );
}
