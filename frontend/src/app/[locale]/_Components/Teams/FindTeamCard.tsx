import { Button } from "@/components/ui/button";
import React from "react";
import HeaderContent from "../CommunityComponent/HeaderContent";
import { Mail, UserPlus } from "lucide-react";

export default function FindTeamCard({ variant }: { variant: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div
        className={`bg-card text-card-foreground flex flex-col ${variant == "teams" ? "gap-6" : "gap-0"}  rounded-xl border-2 hover:border-primary/50 transition-all`}
      >
        {variant == "teams" && (
          <div className="header flex flex-col gap-1.5 px-6 pt-6">
            <h3 className="leading-none font-medium">AI Innovation Team</h3>
            <p className="text-muted-foreground">
              Machine Learning for Healthcare
            </p>
          </div>
        )}
        {variant == "students" && (
          <div className="flex items-start mb-4  gap-4 px-6 pt-6">
            <div className="relative flex rounded-full size-10">
              <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                M
              </span>
            </div>
            <div className="flex flex-col ">
              <div className="flex mb-1 flex-start  flex-col">
                <h2 className="font-medium capitalize">mariem</h2>
                <span className=" text-sm text-muted-foreground">
                  Computer Science • Senior
                </span>
              </div>
              <span className="text-xs text-muted-foreground mb-2">
                GPA: 3.8
              </span>
            </div>
          </div>
        )}
        <div className="px-6 pb-6">
          <p className="pb-3 text-sm text-muted-foreground">
            We're building an AI-powered healthcare diagnosis system and need
            someone skilled in React.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs capitalize">
              ai
            </span>
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs capitalize">
              ai
            </span>
          </div>
          <Button className="w-full text-center">
            {variant == "teams" ? (
                <Mail className=' mr-2 size-4'/>
           
            ) : (
                 <UserPlus className=' mr-2 size-4'/>
         
            )}

            {variant == "teams" ? "Request to Join" : "Invite to My Team"}
          </Button>
        </div>
      </div>
      <div
        className={`bg-card text-card-foreground flex flex-col ${variant == "teams" ? "gap-6" : "gap-0"}  rounded-xl border-2 hover:border-primary/50 transition-all`}
      >
        {variant == "teams" && (
          <div className="header flex flex-col gap-1.5 px-6 pt-6">
            <h3 className="leading-none font-medium">AI Innovation Team</h3>
            <p className="text-muted-foreground">
              Machine Learning for Healthcare
            </p>
          </div>
        )}
        {variant == "students" && (
          <div className="flex items-start mb-4  gap-4 px-6 pt-6">
            <div className="relative flex rounded-full size-10">
              <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                M
              </span>
            </div>
            <div className="flex flex-col ">
              <div className="flex mb-1 flex-start  flex-col">
                <h2 className="font-medium capitalize">mariem</h2>
                <span className=" text-sm text-muted-foreground">
                  Computer Science • Senior
                </span>
              </div>
              <span className="text-xs text-muted-foreground mb-2">
                GPA: 3.8
              </span>
            </div>
          </div>
        )}
        <div className="px-6 pb-6">
          <p className="pb-3 text-sm text-muted-foreground">
            We're building an AI-powered healthcare diagnosis system and need
            someone skilled in React.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs capitalize">
              ai
            </span>
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs capitalize">
              ai
            </span>
          </div>
          <Button className="w-full text-center">
            {variant == "teams" ? (
                 <Mail className=' mr-2 size-4'/>
          
            ) : (
                 <UserPlus className=' mr-2 size-4'/>
           
            )}

            {variant == "teams" ? "Request to Join" : "Invite to My Team"}
          </Button>
        </div>
      </div>
    </div>
  );
}
