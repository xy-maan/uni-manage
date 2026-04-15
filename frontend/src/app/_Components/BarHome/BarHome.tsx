"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
export default function BarHome() {
  const [activeBar, setActiveBar] = useState("student");
  return (
    <>
      <div className="bar flex items-center mb-12 justify-center gap-2 ">
        <div className="student-bar">
          <Button
            className={`flex items-center justify-between text-sm font-medium  rounded-md gap-1.5 px-3 pr-4 has-[>svg]:px-2.5 py-0 cursor-pointer border transition-all duration-200 transform-none  pb-0.75 ${
              activeBar === "student"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            }`}
            onClick={() => {
              setActiveBar("student");
            }}
          >
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
              className="lucide lucide-graduation-cap size-4 mr-2"
            >
              <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
              <path d="M22 10v6"></path>
              <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
            </svg>
            Student View
          </Button>
        </div>
        <div className="">
          <Button
            className={`flex items-center justify-between text-sm font-medium  rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 py-0 cursor-pointer  border transition-all duration-200 transform-none pb-0.75 pr-4 ${
              activeBar === "supervisor"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : " bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            }`}
            onClick={() => {
              setActiveBar("supervisor");
            }}
          >
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
              className="lucide lucide-user-check size-4 mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <polyline points="16 11 18 13 22 9"></polyline>
            </svg>
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
            className="lucide lucide-arrow-right ml-2 h-5 w-5"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Button>
      </div>
    </>
  );
}
