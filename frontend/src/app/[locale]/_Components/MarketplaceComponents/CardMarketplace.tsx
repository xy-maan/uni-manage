import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleCheck, Code, Eye, Star, Users } from "lucide-react";
import React from "react";

export default function CardMarketplace({
  switchLayout,
}: {
  switchLayout: string;
}) {
  return (
<>
    {
    switchLayout=="grid" &&   
        <Card
      className=" p-0 border-primary/30"
    >
        <CardHeader className="p-6 pb-0">
        <div className="flex items-center gap-2 flex-wrap mb-3-">
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CircleCheck className="mr-1 size-3 " />
            Completed{" "}
          </Badge>
          <Badge className="bg-gradient-to-r from-secondary to-primary text-white">
            <Star className="mr-1 size-3" />
            Featured{" "}
          </Badge>
          <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
            Machine Learning{" "}
          </Badge>
        </div>
        <h4 className="text-lg line-clamp-2 mb-3">
          AI-Powered Healthcare Diagnostics System
        </h4>
        <div className="flex items-center justify-between  text-xs text-muted-foreground ">
          <p className="">Fayoum University</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="size-3" />
              245
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-warning text-warning" />
              4.9
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          A deep learning model that assists in early detection of diseases
          through medical imaging analysis. Features include real-time image
          processing, automated diagnosis suggestions, and comprehensive
          reporting.
        </p>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
              <Avatar className=" border-2 border-background size-7 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs text-foreground bg-primary/10 ">
                  A
                </AvatarFallback>
              </Avatar>
              <Avatar className=" border-2 border-background size-7 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs text-foreground bg-primary/10">
                  M
                </AvatarFallback>
              </Avatar>
              <Avatar className=" border-2 border-background size-7 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs text-foreground bg-primary/10">
                  M
                </AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <span className="text-xs text-muted-foreground">3 members</span>
          </div>
          <Badge variant="outline">Grade: A+</Badge>
        </div>
        <div className="mb-4 flex flex-wrap gap-1">
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">+1</Badge>
        </div>
      <div className="border-t pt-2">
        <Button variant="outline" className="w-full">
          <Eye className="size-3" />
          View Details
        </Button>
      </div>
      </CardContent>

    </Card>
    
    }

        {switchLayout=="list" &&   
        <Card
      className=" p-0 border-primary/30 mb-4"
    >
      <CardContent className="p-6 ">
        <div className="flex flex-col lg:flex-row gap-6">

<div className="flex-1">
  <div className="flex justify-between items-start mb-4 lg:flex-row lg:gap-0 gap-2 flex-col">
     <div className="">
         <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CircleCheck className="mr-1 size-3 " />
            Completed{" "}
          </Badge>
          <Badge className="bg-gradient-to-r from-secondary to-primary text-white">
            <Star className="mr-1 size-3" />
            Featured{" "}
          </Badge>
          <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
            Machine Learning{" "}
          </Badge>
              <Badge variant="outline">Grade: A+</Badge>
        </div>
        <h4 className="text-xl font-semibold hover:text-primary transition-all cursor-pointer ">
          AI-Powered Healthcare Diagnostics System
        </h4>
   </div>
     <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Eye className="size-3" />
              245
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-warning text-warning" />
              4.9
            </div>
          </div>
</div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          A deep learning model that assists in early detection of diseases
          through medical imaging analysis. Features include real-time image
          processing, automated diagnosis suggestions, and comprehensive
          reporting.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 ">
          <div className="flex items-center gap-1.5">
            <Users className="size-4"/>
          <span className="">Fayoum University</span>
          </div>
            <div className="flex items-center gap-1.5">
            <Code className="size-4"/>
          <span className="">Research & Development</span>
          </div>
          <div className="flex items-center gap-2">
            <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
              <Avatar className=" border-2 border-background size-6 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs  bg-primary/10 ">
                  A
                </AvatarFallback>
              </Avatar>
              <Avatar className=" border-2 border-background size-6 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs  bg-primary/10">
                  M
                </AvatarFallback>
              </Avatar>
              <Avatar className=" border-2 border-background size-6 shrink-0 flex  ">
                <AvatarFallback className=" flex size-full items-center justify-center  text-xs  bg-primary/10">
                  M
                </AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <span className="text-xs text-muted-foreground">3 members</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
          <Badge variant="outline">Python</Badge>
        </div>
        </div>
      <div className="flex lg:flex-col gap-2 lg:w-48 items-stretch lg:justify-center">
        <Button variant="outline" className="w-full flex-1">
          <Eye className="size-3" />
          View Details
        </Button>
      </div>
</div>
      </CardContent>

    </Card>}
</>

  );
}
