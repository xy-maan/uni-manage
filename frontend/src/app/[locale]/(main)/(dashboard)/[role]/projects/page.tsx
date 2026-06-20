import React from 'react'
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
import CardProject from '@/app/[locale]/_Components/Projects/CardProject/CardProject';
import { Project } from '@/types/team';
import CreateTeamBtn from '@/app/[locale]/_Components/Auth/Forms/CreateTeamBtn/CreateTeamBtn';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import FilteringProjects from '@/app/[locale]/_Components/Projects/FilteringProjects';
export default async function Projects({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  
const {projects= []}=await GetAllProjectsAction()
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 ">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="">
            <h1 className="">My Projects</h1>
          <div className="text-sm text-muted-foreground mt-0.5">{projects.length} project</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className='size-4 mr-2'/>
              Invitations
            <Badge variant={'outline'}>1</Badge>
            </Button>
                
            <CreateTeamBtn role={role}/>
          </div>
        </div>
        <FilteringProjects projects={projects}/>
      </div>
    </div>
  )
}
