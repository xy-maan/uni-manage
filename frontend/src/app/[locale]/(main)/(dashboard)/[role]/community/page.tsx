import { GetPostAction } from "@/Actions/getAllPost.action";
import Community from "@/app/[locale]/_Components/CommunityComponent/Community/Community";
import CreatePost from "@/app/[locale]/_Components/CommunityComponent/CreatePost/CreatePost";
import FilteringCategory from "@/app/[locale]/_Components/CommunityComponent/FilteringCategory";
import SearchInputCatgeory from "@/app/[locale]/_Components/CommunityComponent/SearchInputCategory";
import CommunityProvider from "@/app/Providers/FilteringCategoryProvider";
import { Lock } from "lucide-react";
import { Metadata } from "next";
 export const metadata: Metadata = {
   title: "Community",
 };
export default async function communityUser(){
  return (
        <CommunityProvider>
 <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-col md:flex-row    gap-4">
          <div className="">
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect, collaborate, and learn with students and supervisors
            </p>
          </div>
  <CreatePost/>
        </div>
        <div className="bg-muted rounded-2xl h-9 flex items-center p-0.5 px-4 text-muted-foreground w-fit mb-4 ">
          <div className=" flex items-center justify-center gap-2 text-sm font-medium cursor-pointer rounded-xl h-full text-foreground">
            <Lock className=" size-4"/>
       
            Fayoum University
          </div>
        </div>
      </div>
        



   {/* {c=="student" && */}
         {/* search & select filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <SearchInputCatgeory/>
          <FilteringCategory/>
        </div>
      </div>
      {/* card uni */}
      <div className="text-card-foreground rounded-xl border border-primary/20 bg-primary/5 my-6">
        <div className="pb-6 p-4">
          <div className="flex items-start gap-3">
            <Lock className="size-5 text-primary shrink-0 mt-0.5"/>
           
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-1">
                Fayoum University Community
              </h3>
              <p className="text-xs text-muted-foreground">
                Private space for Fayoum University students and supervisors.
                Discuss university-specific topics, get targeted advice, and
                collaborate with your peers.
              </p>
            </div>
          </div>
        </div>
      </div>
   <Community />
    {/* } */}
     {/* {role=="supervisor" &&
   <Community/>
   } */}
 </div>
   </CommunityProvider>
  );
}
