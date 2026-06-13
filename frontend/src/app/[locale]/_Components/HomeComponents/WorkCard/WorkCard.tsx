"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Award, Layers, UserCheck, Users } from "lucide-react";
export default function WorkCard() {
  return (
     <div className="card-content grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-primary/10 text-primary border-primary/20 border items-center justify-center mb-4">
                  <UserCheck className="size-6"/>
                
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
                  <Users className="size-6"/>
               
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
                   <Layers className="size-6"/>
                
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
                 <Award className="size-6"/>
              
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