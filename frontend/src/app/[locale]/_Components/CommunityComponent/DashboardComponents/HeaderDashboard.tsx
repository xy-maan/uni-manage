import React from 'react'

export default function HeaderDashboard({variant}:{variant:string}) {
  return (
    <div className="mb-8">
           <h2 className="mb-2 text-2xl font-semibold">
            {variant=="student"&&"Welcome back!"}
            {variant=="supervisor"&&"Supervisor Dashboard"}
            </h2>
           <p className="text-muted-foreground">
             {variant=="student"&&"Here's what's happening with your project today."}
            {variant=="supervisor"&&"Monitor and guide your students' graduation projects."}
         
        
           </p>
         </div>
  )
}
