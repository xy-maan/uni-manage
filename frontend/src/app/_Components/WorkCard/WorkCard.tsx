"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
export default function WorkCard() {
  return (
     <div className="card-content grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-primary/10 text-primary border-primary/20 border items-center justify-center mb-4">
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
                      className="lucide lucide-user-check h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                  </CardTitle>
                  <CardDescription className="text-4xl font-bold text-muted-foreground/20 mb-2">
                    01
                  </CardDescription>
                  <h4 className="mb-2">Sign Up & Create Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Join as a student, supervisor, or organization. Build your
                    profile with skills, interests, and goals.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-secondary/10 text-secondary border-secondary/20 border items-center justify-center mb-4">
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
                      className="lucide lucide-users h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </CardTitle>
                  <CardDescription className="text-4xl font-bold text-muted-foreground/20 mb-2">
                    02
                  </CardDescription>
                  <h4 className="mb-2">Find Your Team or Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our AI-powered matching to find the perfect teammates,
                    supervisors, or project opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-success/10 text-success border-success/20 border items-center justify-center mb-4">
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
                      className="lucide lucide-layers h-6 w-6"
                    >
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                    </svg>
                  </CardTitle>
                  <CardDescription className="text-4xl font-bold text-muted-foreground/20 mb-2">
                    03
                  </CardDescription>
                  <h4 className="mb-2">Collaborate & Execute</h4>
                  <p className="text-sm text-muted-foreground">
                    Work together using our suite of project management tools,
                    real-time chat, and task tracking.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10">
              <CardContent className="p-6">
                <CardTitle className="flex size-12 rounded-xl bg-warning/10 text-warning border-warning/20 border items-center justify-center mb-4">
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
                    className="lucide lucide-award h-6 w-6"
                  >
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                </CardTitle>
                <CardDescription className="text-4xl font-bold text-muted-foreground/20 mb-2">
                  04
                </CardDescription>
                <h4 className="mb-2">Complete & Showcase</h4>
                <p className="text-sm text-muted-foreground">
                  Finish your project, get supervisor approval, and showcase
                  your work in the marketplace.
                </p>
              </CardContent>
            </Card>
          </div>
  );
}