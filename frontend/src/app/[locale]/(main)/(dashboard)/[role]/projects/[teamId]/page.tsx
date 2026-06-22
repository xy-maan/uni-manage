import { GetMembershipsAction } from '@/Actions/Memberships/GetAllMembership.action';
import { getSingleProjectAction } from '@/Actions/Project/getSingletProject.action';
import BodyProject from '@/app/[locale]/_Components/Projects/BodyProject/BodyProject';
import HeaderProject from '@/app/[locale]/_Components/Projects/HeaderProject/HeaderProject';
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Badge } from 'lucide-react'
import React from 'react'
import { Metadata } from "next";

 export const metadata: Metadata = {
   title: "Projects",
 };
export default async function SingleProject({
  params,
}: {
  params: Promise<{ teamId: number,role:string }>;
}) {
    const { teamId,role } = await params;
const {payload,ok}=await getSingleProjectAction(teamId)
if(!ok){
  return 
}
if (!payload) {
  return null;
}
// const data=await GetMembershipsAction()
// if(!ok){
//   return 
// }
// if (!payload) {
//   return null;
// }
  return (
    <div className='container mx-auto px-4 lg:px-8 py-8'>
<div className="flex items-center justify-between mb-4">
  <Link href={`/${role}/projects`}>
  <Button className='hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent -ml-2'><ArrowLeft className='mr-1 size-4'/>
   Back to Projects
  </Button>
  </Link>
</div>
<HeaderProject project={payload}/>
<BodyProject project={payload} role={role} />
    </div>
  )
}
