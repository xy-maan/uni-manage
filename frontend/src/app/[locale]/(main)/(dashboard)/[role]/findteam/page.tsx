"use client"
import FilteringCategory from "@/app/[locale]/_Components/CommunityComponent/FilteringCategory";
import SearchInputTeam from "@/app/[locale]/_Components/Teams/SearchInputTeam";
import FindTeamCard from "@/app/[locale]/_Components/Teams/FindTeamCard";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GraduationCap, Users } from "lucide-react";

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
          <Users className="mr-2 size-4"/>
       
          Teams
        </Button>
        <Button
          onClick={() => {
            setSelectType("Students");
          }}
          className="transition-all duration-200 transform-none active:transform-none border border-transparent"
          variant={selectType == "Students" ? "default" : "outline"}
        >
          <GraduationCap className="mr-2 size-4"/>
  
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
