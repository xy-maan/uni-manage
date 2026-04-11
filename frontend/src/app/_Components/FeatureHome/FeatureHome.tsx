"use client"
import { Card, CardContent, CardTitle } from '@/components/ui/card'
export default function FeatureHome() {
  return (
     <div className="card-content grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target h-6 w-6"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  </CardTitle>
                    <h3 className="mb-2">Sign Up & Create Profile</h3>
                    <p className=" text-muted-foreground">
                    Organize tasks, set deadlines, and track progress with intuitive kanban boards and milestone tracking.
                    </p>
                </CardContent>
              </Card>
            </div>
       <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-secondary/10 text-secondary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </CardTitle>
                    <h3 className="mb-2">Team Collaboration</h3>
                    <p className=" text-muted-foreground">
                  Find teammates, communicate effectively, and work together seamlessly with real-time chat.
                    </p>
                </CardContent>
              </Card>
            </div>


             <div className="relative ">
              <div className="absolute w-0.5 h-full bg-border left-1/2 -translate-x-1/2  top-[30%] z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-success/10 text-success items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square h-6 w-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </CardTitle>
                    <h3 className="mb-2">Supervisor Communication</h3>
                    <p className=" text-muted-foreground">
                   Stay connected with your academic supervisor and get timely feedback on your progress.
                    </p>
                </CardContent>
              </Card>
            </div>

             <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-warning/10 text-warning items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap h-6 w-6"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                  </CardTitle>
                    <h3 className="mb-2">AI-Powered Matching
</h3>
                    <p className=" text-muted-foreground">
                  Smart algorithms match students with suitable teams, supervisors, and project opportunities.
                    </p>
                </CardContent>
              </Card>
            </div>

             <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-6 w-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                  </CardTitle>
                    <h3 className="mb-2">Document Management</h3>
                    <p className=" text-muted-foreground">
                   Upload, organize, and share project documents and deliverables securely in one place.
                    </p>
                </CardContent>
              </Card>
            </div>

              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all  z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-secondary/10 text-secondary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-6 w-6"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  </CardTitle>
                    <h3 className="mb-2">Progress Analytics</h3>
                    <p className=" text-muted-foreground">
                   Visualize your project progress and team performance with detailed analytics and reports.
                    </p>
                </CardContent>
              </Card>
            
          </div>
  )
}
