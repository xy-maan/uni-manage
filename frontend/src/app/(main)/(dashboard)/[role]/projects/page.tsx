import StudentProjects from "@/app/_Components/StudentProjects/StudentProjects";
export default async function projectsUser() {
//   const { role } = await params;
  return (
 <div className="container mx-auto px-4 lg:px-8 py-8">
   {/* {role=="student" && */}
   <StudentProjects/>
    {/* } */}
     {/* {role=="supervisor" &&
   <StudentDashboard/>
    } */}
 </div>
  );
}
