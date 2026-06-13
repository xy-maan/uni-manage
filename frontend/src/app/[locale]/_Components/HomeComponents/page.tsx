import React from 'react'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from '@/i18n/navigation';
import CountHome from '@/app/[locale]/_Components/HomeComponents/CountHome/CountHome';
import BarHome from '@/app/[locale]/_Components/HomeComponents/BarHome/BarHome';
import WorkCard from '@/app/[locale]/_Components/HomeComponents/WorkCard/WorkCard';
import FeatureHome from '@/app/[locale]/_Components/HomeComponents/FeatureHome/FeatureHome';
import BenefitHome from '@/app/[locale]/_Components/HomeComponents/BenefitHome/BenefitHome';
import AcademicHome from '@/app/[locale]/_Components/HomeComponents/AcademicHome/AcademicHome';
import Footer from '@/app/[locale]/_Components/Footer/Footer';
import HomeHero from '@/app/[locale]/_Components/HomeComponents/HomeHero/HomeHero';
import { ArrowRight, Sparkles } from 'lucide-react';
export default function HomeUi() {
  return (
  <div className="flex flex-col w-full">
       <HomeHero/>
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
             <Sparkles className='size-8 text-white'/>
              
             </div>
             <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to Excel in Your Graduation Project?</h2>
             <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Join UniManage today and experience the easiest way to manage your graduation project from start to finish.</p>
            <Link href="/login"> <Button className="flex h-10 items-center justify-center gap-2  px-7 has-[>svg]:px-4 bg-white text-primary hover:bg-white/90 py-0">Get Started Free
              <ArrowRight className=' ml-2 size-5'/>
              
             </Button></Link>
         </div>
         </div>
     </div>
     </section>
    <Footer/>
     </div>
  )
}
