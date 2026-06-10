"use client"
import FilteringCategory from "@/app/[locale]/_Components/CommunityComponent/FilteringCategory";
import SearchInputTeam from "@/app/[locale]/_Components/Teams/SearchInputTeam";
import FindTeamCard from "@/app/[locale]/_Components/Teams/FindTeamCard";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function FindTeam() {
    const [selectType, setSelectType] = useState("Teams");

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
         
        <h1 className="mb-2 lg:text-2xl font-semibold"> Find {selectType == "Teams" ? " Teams" : " Students"}</h1>
        <p className="text-muted-foreground">
      Browse{selectType=="Teams"?" teams to join, manage, or supervise":" students to build or expand your team"}
        </p>
      </div>
       <div className="flex gap-2 mb-6">
        <Button
          onClick={() => {
            setSelectType("Teams");
          }}
          className="transition-all duration-200 transform-none active:transform-none border border-transparent"
          variant={selectType == "Teams" ? "default" : "outline"}
        >
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
            className="lucide lucide-users mr-2 size-4"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx={9} cy={7} r={4} />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Teams
        </Button>
        <Button
          onClick={() => {
            setSelectType("Students");
          }}
          className="transition-all duration-200 transform-none active:transform-none border border-transparent"
          variant={selectType == "Students" ? "default" : "outline"}
        >
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
            className="lucide lucide-graduation-cap mr-2 size-4"
          >
            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
          </svg>
          Students
        </Button>
      
      </div>
         <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border mb-8">
        <div className="pb-6 p-6">
          <div className="flex">
            <SearchInputTeam />
          </div>
        </div>
      </div>


  {selectType == "Teams" && <FindTeamCard variant="teams" />}
  {selectType == "Students" && <FindTeamCard variant="students"/>}
      
    </div>
  );
}
