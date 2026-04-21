import { Button } from '@/components/ui/button'
import React from 'react'

export default function CommunityCard() {
  return (
    <div className="card bg-card mb-4 text-card-foreground flex flex-col gap-6 rounded-xl border hover:shadow-md transition-shadow">
<div className="header  gap-1.5 px-6 pt-6  pb-3">
<div className="flex items-start  gap-4">
<div className="relative flex rounded-full size-10">
    <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium">A</span>
</div>
<div className="flex flex-col flex-1 items-start">
<div className="flex items-center justify-between w-full">
  <div className="flex flex-col">
     <div className="flex mb-1  items-center gap-2 flex-wrap">
     <h2 className='font-medium'>Mariem</h2>
    <span className='flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit text-foreground text-xs'>Student</span>
   </div>
     <span className='text-xs text-muted-foreground mb-2'>5 hours ago</span>
  </div>
   <span className='flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit gap-1 bg-secondary/10 text-secondary hover:bg-secondary/20'> idea </span>
</div>
 
   <h2 className='text-lg font-semibold leading-tight mb-2'>Project Idea: AI-Powered Study Group Matcher</h2>
   <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>What if we built a platform that uses ML to match students with compatible study partners based on learning styles, schedules, and course performance? Could help improve collaboration and academic outcomes.</p>
   <div className="flex flex-wrap gap-1">
    <span className='flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs'>AI</span>
    <span className='flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs'>AI</span>
   </div>




</div>
</div>
</div>
<div className=" px-6 pt-0 ">

<div className="flex items-center justify-between pt-3 border-t pb-6">
    <div className="flex items-center gap-4 text-sm text-muted-foreground ">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up h-4 w-4"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /></svg>

                <span>40</span>
            </div>
                <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>

                <span>10</span>
            </div>
                <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-4 w-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>

                <span>40 views</span>
            </div>
    </div>
    <div className="flex items-center gap-2">
        <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit bg-success/10 text-success hover:bg-success/20 gap-1"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-3 w-3"><circle cx={12} cy={12} r={10} /><path d="m9 12 2 2 4-4" /></svg>
        Answered
</span>
<Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md px-3">
<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 lucide-share-2 h-4 w-4"><circle cx={18} cy={5} r={3} /><circle cx={6} cy={12} r={3} /><circle cx={18} cy={19} r={3} /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>

Share
</Button>
<Button className=" bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3">
View Discussion
</Button>
    </div>
</div>
</div>

    </div>
  )
}
