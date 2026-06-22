// import FilteringCategory from "@/app/[locale]/_Components/CommunityComponent/FilteringCategory";
// import SearchInputTeam from "@/app/[locale]/_Components/Teams/SearchInputTeam";
// import { Button } from "@/components/ui/button";
// import React, { useEffect, useState } from "react";
// import { GraduationCap, Users } from "lucide-react";
// import { Project } from "@/types/team";
// import { GetAllStudentsAction } from "@/Actions/Memberships/getAllStudents.action";
// import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
// import FindTeamCard from "@/app/[locale]/_Components/Teams/FindTeamCard";

// export default async function FindTeam(){

//     const { payload: projects } = await GetAllProjectsAction();
//   const { payload: students } = await GetAllStudentsAction();

//   return (
//     <div className="container mx-auto px-4 lg:px-8 py-8">
//       <div className="mb-6">
         
//         <h1 className="mb-2 lg:text-2xl font-semibold"> Find {selectType == "Teams" ? " Teams" : " Students"}</h1>
//         <p className="text-muted-foreground">
//       Browse{selectType=="Teams"?" teams to join, manage, or supervise":" students to build or expand your team"}
//         </p>
//       </div>
//        <div className="flex gap-2 mb-6">
//         <Button
//           onClick={() => {
//             setSelectType("Teams");
//           }}
//           className="transition-all duration-200 transform-none active:transform-none border border-transparent"
//           variant={selectType == "Teams" ? "default" : "outline"}
//         >
//           <Users className="mr-2 size-4"/>
       
//           Teams
//         </Button>
//         <Button
//           onClick={() => {
//             setSelectType("Students");
//           }}
//           className="transition-all duration-200 transform-none active:transform-none border border-transparent"
//           variant={selectType == "Students" ? "default" : "outline"}
//         >
//           <GraduationCap className="mr-2 size-4"/>
  
//           Students
//         </Button>
      
//       </div>
//          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border mb-8">
//         <div className="pb-6 p-6">
//           <div className="flex">
//             <SearchInputTeam />
//           </div>
//         </div>
//       </div>


//   <div className="grid md:grid-cols-2 gap-6">
//         {projects?.map((project: any) => (
//           <FindTeamCard key={project.id} project={project} />
//         ))}
//       </div>

//    <div className="grid md:grid-cols-2 gap-6">
//         {students?.map((student: any) => (
//           <FindTeamCard key={student.id} student={student} />
//         ))}
//       </div>
      
//     </div>
//   );
// }
// // app/[role]/findteam/page.tsx

import SearchInputTeam from "@/app/[locale]/_Components/Teams/SearchInputTeam";
import FindTeamTabs from "@/app/[locale]/_Components/FindTeamTabs";
import { GetAllStudentsAction } from "@/Actions/Memberships/getAllStudents.action";
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Team",
};
export default async function FindTeam() {

  const { payload: projects ,myProject} = await GetAllProjectsAction();
  const { payload: students } = await GetAllStudentsAction();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <FindTeamTabs
        projects={projects ?? []}
        students={students ?? []}
        currentProjectId={myProject?.id}
      />
    </div>
  );
}