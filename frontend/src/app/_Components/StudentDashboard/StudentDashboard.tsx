import React from "react";
import ProjectCard from "../ProjectCard/ProjectCard";

export default function StudentDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-semibold">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your project today.
        </p>
      </div>
      <ProjectCard
      activeBar= "student"
      title="AI-Powered Study Assistant"
  subtitle="Supervised by Dr. Abdulrahman"
  topCard={false}
  isSkills={false}
  isDetails={false}
  variant="dashboard" />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8  ">
        <div className="card bg-card text-card-foreground rounded-xl border">
            <div className="item-card p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-foreground/80 mb-1">Tasks Completed</h5>
                        <p className="text-3xl font-semibold mb-2">12/18</p>
                    </div>
                    <div className="rounded-xl p-3 bg-success/10 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check size-6"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                    </div>
            </div>
        </div>
         <div className="card bg-card text-card-foreground rounded-xl border">
            <div className="item-card p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-foreground/80 mb-1">Pending Tasks</h5>
                        <p className="text-3xl font-semibold mb-2">6</p>
                    </div>
                    <div className="rounded-xl p-3  bg-warning/10 text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock size-6"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
            </div>
        </div>
         <div className="card bg-card text-card-foreground rounded-xl border">
            <div className="item-card p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-foreground/80 mb-1">Team Members</h5>
                        <p className="text-3xl font-semibold mb-2">4</p>
                    </div>
                    <div className="rounded-xl p-3 bg-primary/10 text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users size-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
            </div>
        </div>
         <div className="card bg-card text-card-foreground rounded-xl border">
            <div className="item-card p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-foreground/80 mb-1">Documents</h5>
                        <p className="text-3xl font-semibold mb-2">23</p>
                    </div>
                    <div className="rounded-xl p-3  bg-secondary/10 text-secondary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text size-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                    </div>
            </div>
        </div>
    </div>
    </div>
  );
}
