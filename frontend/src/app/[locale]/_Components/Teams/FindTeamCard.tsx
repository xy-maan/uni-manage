import { Button } from "@/components/ui/button";
import React from "react";
import HeaderContent from "../CommunityComponent/HeaderContent";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail mr-2 size-4"
              >
                <rect width={20} height={16} x={2} y={4} rx={2} />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-plus mr-2 size-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <line x1={19} x2={19} y1={8} y2={14} />
                <line x1={22} x2={16} y1={11} y2={11} />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail mr-2 size-4"
              >
                <rect width={20} height={16} x={2} y={4} rx={2} />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-plus mr-2 size-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <line x1={19} x2={19} y1={8} y2={14} />
                <line x1={22} x2={16} y1={11} y2={11} />
              </svg>
            )}

            {variant == "teams" ? "Request to Join" : "Invite to My Team"}
          </Button>
        </div>
      </div>
    </div>
  );
}
