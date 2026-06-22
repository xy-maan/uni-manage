"use client"
import React, { useState } from 'react'
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
import CardProject from '@/app/[locale]/_Components/Projects/CardProject/CardProject';
import { Project } from '@/types/team';
import CreateTeamBtn from '@/app/[locale]/_Components/Auth/Forms/CreateTeamBtn/CreateTeamBtn';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
export default function FilteringProjects({projects}:{projects:Project[]}) {
const statuses = [
  { label: "All", value: "all" },
  { label: "Forming", value: "forming" },
  { label: "Active", value: "active" },
  { label: "Under Review", value: "under_review" },
  { label: "Submitted", value: "submitted" },
  { label: "Archived", value: "archived" },
];
  const [status, setStatus] = useState("all");
const filteredProjects =
  status === "all"
    ? projects
    : projects.filter(
        (project) => project.status === status
      );
  return (
    <div>

        <div className="flex flex-col sm:flex-row gap-3">
                     <Field className="gap-2 flex-1 max-w-xs">
              <InputGroup className=" ">
                <InputGroupInput placeholder="Search projects..." />
                <InputGroupAddon align="inline-start">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <div className="flex gap-1.5 flex-wrap">
           {statuses.map((item) => (
  <Button
    key={item.value}
    variant={status === item.value ? "default" : "outline"}
    onClick={() => setStatus(item.value)}
    className="py-0 h-8 text-xs border"
  >

    {item.label}
  </Button>
))}
            </div>
        </div>
        {filteredProjects?.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {filteredProjects?.map((project: Project) => (
            <CardProject key={project.id} project={project} />
          ))}
        </div>}
    </div>
  )
}
