import React from 'react'
import FeedbackSection from '../Tasks/FeedbackSection'
import { Membership, Project } from '@/types/team'
export default function FeedBackTab({
   projectId,
  isSupervisor,
  currentUserEmail,
}: {
  projectId: number;
  isSupervisor: boolean;
  currentUserEmail: string;
}){
  return (
   
    <FeedbackSection projectId={projectId} isSupervisor={isSupervisor} currentUserEmail={currentUserEmail} />
  )
}
