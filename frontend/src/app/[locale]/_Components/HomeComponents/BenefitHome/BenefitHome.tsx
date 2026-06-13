import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from '@/i18n/navigation';
import React from "react";
import { ArrowRight, CircleCheck, Shield } from "lucide-react";

export default function BenefitHome() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="left-side lg:mt-3 order-2 lg:order-1 relative ">
        <div className="image-benefit rounded-2xl shadow-2xl border-4 border-background">
          <Image
            src="/images/Benefit.jpg"
            alt="Project management analytics dashboard showing success metrics"
            width={600}
            height={400}
            className="rounded-2xl w-full"
          />
        </div>
        <div className="absolute flex items-center justify-center gap-2 bg-background rounded-xl shadow-2xl p-4 border-2 border-success/20 backdrop-blur-sm -top-4 -right-4">
          <div className=" rounded-lg bg-linear-to-br from-success to-success/70 flex items-center justify-center shadow-md">
            <div className="size-10 rounded-lg bg-linear-to-br from-success to-success/70 flex items-center justify-center shadow-md">
            <Shield className=" size-6 text-white"/>
          
            </div>
          </div>
          <div className="">
            <h3 className="font-semibold text-sm">Secure & Trusted</h3>
            <p className="text-xs text-muted-foreground">ISO Certified</p>
          </div>
        </div>
      </div>
      <div className="right-side  flex  flex-col flex-start space-y-6 order-1 lg:order-2">
        <span className="rounded-md border px-2 py-0.5 text-xs font-medium w-fit text-foreground [a&]:hover:bg-accent mb-2">
          Benefits
        </span>
        <h2 className="text-3xl lg:text-5xl font-bold">
          Why Students Choose UniManage
        </h2>
        <p className="text-lg text-muted-foreground">
          Join thousands of students who successfully managed their graduation
          projects with our platform.
        </p>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
             <CircleCheck className="size-4 text-success"/>
            </div>
            <p className="text-foreground">
              {" "}
              Search for teams based on skills and interests
            </p>
          </div>
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
            <CircleCheck className="size-4 text-success"/>
            </div>
            <p> Real-time collaboration and chat</p>
          </div>
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
            <CircleCheck className="size-4 text-success"/>
            </div>
            <p className="text-foreground">Task assignment and tracking</p>
          </div>
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
         <CircleCheck className="size-4 text-success"/>
            </div>
            <p className="text-foreground">Supervisor feedback and approvals</p>
          </div>
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
            <CircleCheck className="size-4 text-success"/>
            </div>
            <p className="text-foreground">File sharing and version control</p>
          </div>
          <div className="flex items-center  gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-default">
            <div className="size-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
             <CircleCheck className="size-4 text-success"/>
            </div>
            <p className="text-foreground">Progress reports and analytics</p>
          </div>
        </div>
        <Link href="/login">
          <Button className="w-fit h-10">
            Start Your Project Today
            <ArrowRight className="ml-2 size-5"/>
      
          </Button>
        </Link>
      </div>
    </div>
  );
}
