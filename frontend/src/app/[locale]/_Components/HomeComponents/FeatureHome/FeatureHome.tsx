"use client"
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Target, TrendingUp, Users, Zap } from 'lucide-react'
export default function FeatureHome() {
  return (
     <div className="card-content grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <div className="relative ">
              <div className="absolute h-0.5  bg-border w-full  top-[30%] left-3/4 z-0 lg:block hidden"></div>
              <Card className="bg-card text-card-foreground flex flex-col gap-2 p-0 rounded-x border-2 hover:border-primary/50 transition-all relative z-10  hover:shadow-lg  group">
                <CardContent className="p-6">
                  <CardTitle className="flex size-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className='size-6'/>
           
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
                               <Users className='size-6'/>

            
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
                                    <MessageSquare className='size-6'/>

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
                                    <Zap className='size-6'/>

            
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
                              <FileText className='size-6'/>
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
         <TrendingUp className='size-6'/>
            
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
