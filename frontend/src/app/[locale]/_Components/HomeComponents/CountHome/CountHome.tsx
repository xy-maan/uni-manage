import { Award, Building2, TrendingUp, Users } from "lucide-react";
import React from "react";
const countData = [
  {
    icon: (
        <Users className="size-6 text-primary"/>
  
    ),
    number: "10,000+",
    title: " Active Students",
  },
  {
    icon: (
      <Building2 className="size-6 text-primary"/>
    ),
    number: "1+",
    title: " Universities",
  },
  {
    icon: (
      <Award className="size-6 text-primary"/>
  
    ),
    number: " 2,500+",
    title: "  Projects Completed",
  },
  {
    icon: (
        <TrendingUp className="size-6 text-primary"/>
     
    ),
    number: "98%",
    title: " Success Rate",
  },
];
export default function CountHome() {
  return (
    <div className="section-count py-12 border-y bg-muted/30 w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="items grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 ">
         {countData.map((item,i) => (
    <div className="child group flex flex-col  items-center text-center" key={i}>
            <div className="flex justify-center mb-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
              {item.icon}
              </div>
            </div>
            <h3 className="count text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-colors">
              {item.number}
            </h3>
            <span className="text-xs md:text-sm text-muted-foreground">
             {item.title}
            </span>
          </div>
  ))}
        </div>
      </div>
    </div>
  );
}
