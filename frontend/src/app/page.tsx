import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {

  return(
     <div className="flex flex-col items-center ">
    <div className="section-home flex items-center justify-center  bg-linear-to-br from-primary/5 via-secondary/5 to-background py-20 lg:py-32 overflow-hidden">
      <div className="flex  w-full  flex-col items-center justify-between sm:items-start ">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-12 items-center justify-center">
            <div className="left-side space-y-6 lg:w-1/2 w-full">
              <span className=" items-center justify-center gap-1 px-2 py-0.5 text-xs rounded-md border bg-primary/10 [&>svg]:size-3 text-primary border-primary/20 flex w-fit font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucideSparkles h-3 w-3 mr-1"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  <path d="M20 3v4"></path>
                  <path d="M22 5h-4"></path>
                  <path d="M4 17v2"></path>
                  <path d="M5 18H3"></path>
                </svg>
                The Ultimate Academic Project Platform
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Manage Your <span className="text-primary">Graduation </span>
                Projects with{" "}
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              <h2 className="text-xl text-muted-foreground font-medium italic">
                UniManage — Manage Your Uni Life
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Everything you need to successfully plan, execute, and complete
                your academic projects. From course assignments to graduation
                projects - find teammates, collaborate with supervisors, and
                track your progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login"><Button className="flex items gap-2 justify-center text-sm font-medium [&_svg]:size-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 shadow-lg hover:shadow-xl has-[>svg]:px-4 cursor-pointer">Get Started Free <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-5 w-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></Button>
                </Link>
                <Button className="flex items gap-2 justify-center text-sm font-medium [&_svg]:size-4 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 shadow-md hover:shadow-lg  has-[>svg]:px-4 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye mr-2 h-5 w-5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg> Browse Projects</Button>
                
              </div>
              <div className=" justify-start  flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                    <div className="size-10 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucideGraduation-cap h-5 w-5 text-white"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                    </div>
                   < div className="size-10 rounded-full bg-secondary  border-2 border-background flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-5 w-5 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                   < div className="size-10 rounded-full bg-success border-2 border-background flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target h-5 w-5 text-white"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    </div>
                </div>
                <div className="">
                  <h3 className="font-medium text-sm">Trusted by 10,000+ students</h3>
                  <p className="text-muted-foreground text-sm">across 50+ universities</p>
                </div>
              </div>
            </div>

            <div className="right-left relative lg:w-1/2 w-full">
              <div className="image-home  rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                <Image
                  src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnRzJTIwY29sbGFib3JhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5ODIyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  width={200}
                  height={200}
                  className="w-full"
                  alt=""
                ></Image>
              </div>
              <div className="absolute flex items-center justify-center gap-3 bg-background rounded-xl shadow-2xl p-4 border-2 border-primary/10 -bottom-6 -left-6 ">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-success to-success/70 flex items-center justify-center shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucideCircle-check h-6 w-6 text-white"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div className="">
                  <h3 className="font-semibold text-lg">98% Success Rate</h3>
                  <p className="text-sm text-muted-foreground">
                    Project completion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="section-count py-12 border-y bg-muted/30 w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="items flex items-center justify-center gap-6 md:gap-8 ">
          <div className="child group flex flex-col lg:w-1/4 md:1/2 w-full  items-center text-center">
            <div className="flex justify-center mb-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-6 w-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <h3 className="count text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-colors">10000</h3>
            <span className="text-xs md:text-sm text-muted-foreground">Active Students</span>
          </div>
            <div className="child group flex flex-col lg:w-1/4 md:1/2 w-full  items-center text-center">
            <div className="flex justify-center mb-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-6 w-6 text-primary"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
              </div>
            </div>
            <h3 className="count text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-colors">1</h3>
            <span className="text-xs md:text-sm text-muted-foreground">Universities</span>
          </div>
            <div className="child group flex flex-col lg:w-1/4 md:1/2 w-full  items-center text-center">
            <div className="flex justify-center mb-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-6 w-6 text-primary"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
              </div>
            </div>
            <h3 className="count text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-colors">2,500+</h3>
            <span className="text-xs md:text-sm text-muted-foreground">Projects Completed</span>
          </div>
            <div className="child group flex flex-col lg:w-1/4 md:1/2 w-full  items-center text-center">
            <div className="flex justify-center mb-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-6 w-6 text-primary"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
            </div>
            <h3 className="count text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-colors">98%</h3>
            <span className="text-xs md:text-sm text-muted-foreground">Success Rate</span>
          </div>
        </div>

      </div>
    </div>
    <div className="section-project py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="content text-center mb-12 flex flex-col items-center">
                <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-4">
                  Featured Projects
                </span>
                <h2 className="text-3xl lg:text-5xl font-bold mb-4">Discover Outstanding Student Work</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Browse real graduation projects from talented students. See what's possible with UniManage.</p>
            </div>
        </div>
    </div>
 </div>
 )
}
