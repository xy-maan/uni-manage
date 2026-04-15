import Marketplace from "@/app/_Components/Marketplace/Marketplace";
export default async function MarketUser() {
  return (
 <div className="container mx-auto px-4 lg:px-8 py-8">
   {/* {role=="student" && */}
   <Marketplace/>
    {/* } */}
     {/* {role=="supervisor" &&
   <StudentDashboard/>
    } */}
 </div>
  );
}
