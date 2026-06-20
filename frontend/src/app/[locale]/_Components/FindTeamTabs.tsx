"use client";

import { useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import FindTeamCard from "@/app/[locale]/_Components/Teams/FindTeamCard";
import SearchInputTeam from "./Teams/SearchInputTeam";
import { Project } from "@/types/team";

interface FindTeamTabsProps {
  projects: Project[];
  students: any[];
  currentProjectId:number|undefined
}

export default function FindTeamTabs({
  projects,
  students,
  currentProjectId
}: FindTeamTabsProps) {
  const [selectType, setSelectType] = useState<"Teams" | "Students">("Teams");

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 lg:text-2xl font-semibold">
          Find {selectType === "Teams" ? "Teams" : "Students"}
        </h1>

        <p className="text-muted-foreground">
          Browse{" "}
          {selectType === "Teams"
            ? "teams to join, manage, or supervise"
            : "students to build or expand your team"}
        </p>
      </div>
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setSelectType("Teams")}
          variant={selectType === "Teams" ? "default" : "outline"}
          className="border"
        >
          <Users className="mr-2 size-4" />
          Teams
        </Button>

        <Button
          onClick={() => setSelectType("Students")}
          variant={selectType === "Students" ? "default" : "outline"}
          className="border"
        >
          <GraduationCap className="mr-2 size-4" />
          Students
        </Button>
      </div>

 <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border mb-8">
        <div className="pb-6 p-6">
          <SearchInputTeam />
        </div>
      </div>
      {selectType === "Teams" && (
        <div className="grid md:grid-cols-2 gap-6">
          {projects?.map((project) => (
            <FindTeamCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {selectType === "Students" && (
        <div className="grid md:grid-cols-2 gap-6">
          {students?.map((student) => (
            <FindTeamCard key={student.id} student={student}  currentProjectId={currentProjectId}/>
          ))}
        </div>
      )}
    </>
  );
}