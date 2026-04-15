import StudentDashboard from "@/app/_Components/StudentDashboard/StudentDashboard";
export default async function DashboardUser() {
  // const { role } = await params;
  return (
 <div className="container mx-auto px-4 lg:px-8 py-8">
   {/* {role=="student" && */}
   <StudentDashboard/>
    {/* } */}
     {/* {role=="supervisor" &&
   <StudentDashboard/>
    } */}
 </div>
  );
}
