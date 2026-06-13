import React from "react";
import CardMeth from "@/app/[locale]/_Components/Projects/Methodology/CardMeth";
import HeaderMeth from "@/app/[locale]/_Components/Projects/Methodology/HeaderMeth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CircleAlert,
  Clock,
  EllipsisVertical,
  Funnel,
  LayoutGrid,
  Plus,
  Settings2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
export default function FlexiblePage() {
  return (
    <div>
      <HeaderMeth variant="flexible" />
      <CardMeth variant="flexible" />
      <div className="my-6 h-8 flex justify-between">
        <div className="flex items-center gap-2">
          <Button className="my-0" variant="outline">
            <Funnel className="mr-2" />
            Filter
          </Button>
          <Button className="my-0" variant="outline">
            <Users className="mr-2" />
            Assigned to Me
          </Button>
        </div>
        <Button className="my-0" variant="outline">
          <Settings2 className="mr-2" />
          Configure Board
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        {/* <div className="w-[320px] shrink-0 "> */}
        <Card className="p-0 bg-muted/30 w-[320px] shrink-0">
          <CardHeader className="px-6 pt-6 pb-3 ">
            <div className="flex justify-between items-center">
              <div className="left-side flex items-center gap-2">
                <h4 className="text-base">Backlog</h4>
                <Badge className="border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
                  1
                </Badge>
              </div>
              <Button className="bg-transparent  h-8 w-8 p-0 ">
                <Plus className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="min-h-100 p-6 pt-0 space-y-3 ">
            <div className="flex flex-col  bg-background rounded-xl mt-4  p-4 border hover:border-primary/50">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="">
                  <h3 className="text-sm font-medium leading-tight mb-1">
                    Add notifications system
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Real-time notifications for updates
                  </p>
                </div>
                <Button className="size-6 -mt-1 bg-transparent hover:bg-transparent">
                  <EllipsisVertical className="size-3" />
                </Button>
              </div>
              <Badge className="bg-transparent border-border text-foreground mb-3">
                feature
              </Badge>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                    <Plus className="size-3" />
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  medium
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
        {/* <div className="w-[320px] shrink-0 "> */}
        <Card className="p-0 border-secondary/30 bg-secondary/5 w-[320px] shrink-0">
          <CardHeader className="px-6 pt-6 pb-3 ">
            <div className="flex justify-between items-center">
              <div className="left-side flex items-center gap-2">
                <h4 className="text-base">Ready</h4>
                <Badge className="border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
                  3/5
                </Badge>
              </div>

              <Button className="bg-transparent  h-8 w-8 p-0 ">
                <Plus className="size-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">WIP Limit: 5</span>
          </CardHeader>
          <CardContent className="min-h-100 p-6 pt-0 space-y-3 ">
            <div className="flex flex-col  bg-background rounded-xl  p-4 border hover:border-primary/50">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="">
                  <h3 className="text-sm font-medium leading-tight mb-1">
                    Update documentation
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    API documentation and user guide
                  </p>
                </div>
                <Button className="size-6 -mt-1 bg-transparent hover:bg-transparent">
                  <EllipsisVertical className="size-3" />
                </Button>
              </div>
              <Badge className="bg-transparent border-border text-foreground mb-3">
                docs
              </Badge>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs">
                    A
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    1d
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  medium
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
        {/* <div className="w-[320px] shrink-0 "> */}
        <Card className="p-0 border-primary/30 bg-primary/5 w-[320px] shrink-0 ">
          <CardHeader className="px-6 pt-6 pb-3 ">
            <div className="flex justify-between items-center">
              <div className="left-side flex items-center gap-2">
                <h4 className="text-base">In Progress</h4>
                <Badge className="border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
                  2/3
                </Badge>
              </div>

              <Button className="bg-transparent  h-8 w-8 p-0 ">
                <Plus className="size-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">WIP Limit: 3</span>
          </CardHeader>
          <CardContent className="min-h-100 p-6 pt-0 space-y-3 ">
            <div className="flex flex-col  bg-background rounded-xl  p-4 border hover:border-primary/50">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="">
                  <h3 className="text-sm font-medium leading-tight mb-1">
                    Design dashboard UI
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Create mockups for main dashboard
                  </p>
                </div>
                <Button className="size-6 -mt-1 bg-transparent hover:bg-transparent">
                  <EllipsisVertical className="size-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-transparent border-border text-foreground mb-3">
                  frontent
                </Badge>
                <Badge className="bg-transparent border-border text-foreground mb-3">
                  design
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs">
                    A
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    1d
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  medium
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
        {/* <div className="w-[320px] shrink-0 "> */}

        <Card className="p-0  border-warning/30 bg-warning/5 w-[320px] shrink-0 ">
          <CardHeader className="px-6 pt-6 pb-3 ">
            <div className="flex justify-between items-center">
              <div className="left-side flex items-center gap-2">
                <h4 className="text-base">In Review</h4>
                <Badge className="border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
                  2/2
                </Badge>
              </div>

              <Button className="bg-transparent  h-8 w-8 p-0 ">
                <Plus className="size-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">WIP Limit: 3</span>
          </CardHeader>
          <CardContent className="min-h-100 p-6 pt-0 space-y-3 ">
            <div className="flex flex-col  bg-background rounded-xl  p-4 border hover:border-primary/50">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="">
                  <h3 className="text-sm font-medium leading-tight mb-1">
                    Write unit tests
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Test coverage for authentication
                  </p>
                </div>
                <Button className="size-6 -mt-1 bg-transparent hover:bg-transparent">
                  <EllipsisVertical className="size-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-transparent border-border text-foreground mb-3">
                  testing
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs">
                    A
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    1d
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  medium
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
        {/* <div className="w-[320px] shrink-0 "> */}

        <Card className="p-0  border-success/30 bg-success/5 w-[320px] shrink-0 ">
          <CardHeader className="px-6 pt-6 pb-3 ">
            <div className="flex justify-between items-center">
              <div className="left-side flex items-center gap-2">
                <h4 className="text-base">Done</h4>
                <Badge className="border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
                  2
                </Badge>
              </div>

              <Button className="bg-transparent  h-8 w-8 p-0 ">
                <Plus className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="min-h-100 p-6 pt-0 space-y-3 ">
            <div className="flex flex-col  bg-background rounded-xl  p-4 border hover:border-primary/50 mt-3.5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="">
                  <h3 className="text-sm font-medium leading-tight mb-1">
                    Implement user authentication
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Add login and signup functionality
                  </p>
                </div>
                <Button className="size-6 -mt-1 bg-transparent hover:bg-transparent">
                  <EllipsisVertical className="size-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-transparent border-border text-foreground mb-3">
                  testing
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs">
                    A
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    1d
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                  medium
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
      </div>

      <div className="footer-flexible">
        <Card className="border to-do p-0 gap-6 flex flex-col bg-card text-card-foreground  ">
          <CardHeader className="gap-1.5 px-6 pt-6">
            <h4 className="leading-none">Flow Metrics</h4>
          </CardHeader>
          <CardContent className="task transition-all cursor-pointer  px-6 pb-6 space-y-3">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col lg:gap-4 gap-3">
              <Card className="p-4 gap-0">
                <CardHeader className="gap-2 mb-2 flex items-center p-0 text-sm font-medium">
                  <TrendingUp className="text-primary size-4" />
                  Throughput
                </CardHeader>
                <CardContent className="p-0">
                  <h5 className="text-2xl font-bold">2</h5>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed
                  </p>
                </CardContent>
              </Card>
              <Card className="p-4 gap-0">
                <CardHeader className="gap-2 mb-2 flex items-center p-0 text-sm font-medium">
                  <Clock className="text-secondary size-4" />
                  Cycle Time
                </CardHeader>
                <CardContent className="p-0">
                  <h5 className="text-2xl font-bold">3.2d</h5>
                  <p className="text-xs text-muted-foreground">
                    Average completion time
                  </p>
                </CardContent>
              </Card>
              <Card className="p-4 gap-0">
                <CardHeader className="gap-2 mb-2 flex items-center p-0 text-sm font-medium">
                  <LayoutGrid className="text-success size-4" />
                  WIP
                </CardHeader>
                <CardContent className="p-0">
                  <h5 className="text-2xl font-bold">3.2d</h5>
                  <p className="text-xs text-muted-foreground">
                    Work in progress
                  </p>
                </CardContent>
              </Card>
              <Card className="p-4 gap-0">
                <CardHeader className="gap-2 mb-2 flex items-center p-0 text-sm font-medium">
                  <CircleAlert className="text-warning size-4" />
                  WIP
                </CardHeader>
                <CardContent className="p-0">
                  <h5 className="text-2xl font-bold">1</h5>
                  <p className="text-xs text-muted-foreground">
                    Tasks need attention
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
