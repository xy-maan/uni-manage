import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CountHome from "./_Components/CountHome/CountHome";
import BarHome from "./_Components/BarHome/BarHome";
import WorkCard from "./_Components/WorkCard/WorkCard";
import FeatureHome from "./_Components/FeatureHome/FeatureHome";
import BenefitHome from "./_Components/BenefitHome/BenefitHome";
import AcademicHome from "./_Components/AcademicHome/AcademicHome";
import Footer from "./_Components/Footer/Footer";
import getAuthData from "@/utilities/getAuthData";
export default async function Home() {
  return (
    <div className="flex flex-col w-full">
      <div  className="section-home relative flex items-center justify-center  bg-linear-to-br from-primary/5 via-secondary/5 to-background py-20 lg:py-32 overflow-hidden ">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-20 left-10 h-72 w-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="flex   w-full  flex-col items-center justify-between sm:items-start ">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="lg:flex-row flex flex-col gap-12 items-center justify-center">
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
                  Everything you need to successfully plan, execute, and
                  complete your academic projects. From course assignments to
                  graduation projects - find teammates, collaborate with
                  supervisors, and track your progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button className="flex items gap-2 justify-center text-sm font-medium [&_svg]:size-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 shadow-lg hover:shadow-xl has-[>svg]:px-4 cursor-pointer">
                      Get Started Free{" "}
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
                        className="lucide lucide-arrow-right ml-2 h-5 w-5"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Button>
                  </Link>
                  <Button className="flex items gap-2 justify-center text-sm font-medium [&_svg]:size-4 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 shadow-md hover:shadow-lg  has-[>svg]:px-4 cursor-pointer">
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
                      className="lucide lucide-eye mr-2 h-5 w-5"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>{" "}
                    Browse Projects
                  </Button>
                </div>
                <div className=" justify-start  flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    <div className="size-10 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-md">
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
                        className="lucide lucideGraduation-cap h-5 w-5 text-white"
                      >
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                        <path d="M22 10v6"></path>
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                      </svg>
                    </div>
                    <div className="size-10 rounded-full bg-secondary  border-2 border-background flex items-center justify-center shadow-md">
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
                        className="lucide lucide-users h-5 w-5 text-white"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="size-10 rounded-full bg-success border-2 border-background flex items-center justify-center shadow-md">
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
                        className="lucide lucide-target h-5 w-5 text-white"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="">
                    <h3 className="font-medium text-sm">
                      Trusted by 10,000+ students
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      across 50+ universities
                    </p>
                  </div>
                </div>
              </div>

              <div className="right-left relative lg:w-1/2 w-full">
                <div className="image-home rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                  <Image
                    src="/images/Home.jpg"
                    width={200}
                    height={200}
                    className="w-full"
                    alt=""
                  ></Image>
                </div>
                <div className="absolute flex items-center justify-center gap-3 bg-background rounded-xl shadow-2xl p-4 border-2 border-primary/10 -bottom-6 -left-6 ">
                  <div className=" rounded-lg bg-linear-to-br from-success to-success/70 flex items-center justify-center shadow-md">
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
                      className="lucide lucideCircle-check size-6 text-white"
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
    <CountHome/>
      <div id="projects" className="section-project py-20 lg:py-32 w-full">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="content text-center  flex flex-col items-center">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-4">
              Featured Projects
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Discover Outstanding Student Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse real graduation projects from talented students. See what's
              possible with UniManage.
            </p>
          </div>
         <BarHome/>
        </div>
      </div>

      <div id="work" className="section-work py-20 lg:py-32 bg-muted/30 ">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="content text-center mb-12 flex flex-col items-center">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-4">
              How It Works
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Your Journey to Project Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              From registration to completion - we guide you every step of the
              way
            </p>
          </div>
          <WorkCard/>
        </div>
      </div>

      <div  id="feature" className="section-Features py-20 lg:py-32 w-full">
        <div className="container mx-auto  px-4 lg:px-8">
          <div className="content text-center mb-16 flex flex-col items-center">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-4">
              Features
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Powerful tools designed specifically for university graduation
              projects
            </p>
          </div>
       <FeatureHome/>
        </div>
      </div>
 <section className='section-benefits py-20 lg:py-32 bg-muted/30'>
        <div className="container mx-auto px-4 lg:px-8">
      <BenefitHome/>
    </div>
    </section>
          <section id="access" className='role-academic py-20 lg:py-32'>
            <div className="container mx-auto px-4 lg:px-8">
                <div className="content text-center  flex flex-col items-center">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-4">
              Choose Your Access

            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            How Would You Like to Get Started?

            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
             Select the option that best fits your role and needs


            </p>
          </div>
          <div className="mb-6 text-start">
            <h3 className="text-2xl font-bold mb-2">Academic</h3>
            <p className="text-muted-foreground">Full platform access for students and supervisors</p>
          </div>
          <AcademicHome/>
            </div>
    </section>
    <section className="py-20 lg:py-32 bg-muted/30">
    <div className="container mx-auto px-4 lg:px-8  ">
        <div className="relative flex flex-col gap-6 rounded-xl bg-linear-to-br from-primary via-primary to-secondary text-white border-0 overflow-hidden ">
     <div className="absolute inset-0 bg-linear-to-r from-primary/50 to-secondary/50 backdrop-blur-sm"></div>
        <div className="content flex flex-col items-center text-center lg:pb-6 pb-6 px-12 pt-12 relative">
            <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-8 w-8 text-white"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to Excel in Your Graduation Project?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Join UniManage today and experience the easiest way to manage your graduation project from start to finish.</p>
           <Link href="/login"> <Button className="flex h-10 items-center justify-center gap-2  px-7 has-[>svg]:px-4 bg-white text-primary hover:bg-white/90 py-0">Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-5 w-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Button></Link>
        </div>
        </div>
    </div>
    </section>
   <Footer/>
    </div>
  );
}
