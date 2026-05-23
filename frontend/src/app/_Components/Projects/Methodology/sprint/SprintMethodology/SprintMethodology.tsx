import CardMeth from "@/app/_Components/Projects/Methodology/CardMeth";
import HeaderMeth from "@/app/_Components/Projects/Methodology/HeaderMeth";
import Done from "@/app/_Components/Projects/Methodology/sprint/Done";
import InProgress from "@/app/_Components/Projects/Methodology/sprint/InProgress";
import ToDo from "@/app/_Components/Projects/Methodology/sprint/ToDoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Zap } from "lucide-react";
export default function SprintPage() {
  return (
    <div>
      <HeaderMeth variant="sprint" />
      <CardMeth variant="sprint" />
      <div className="grid lg:grid-cols-3 gap-6 my-6 ">
        <ToDo />
        <InProgress />
        <Done />
      </div>

      <div className="footer-sprint">
        <Card className="border to-do p-0 gap-6 flex flex-col bg-card text-card-foreground  ">
          <CardHeader className="gap-1.5 px-6 pt-6">
            <div className="flex items-center justify-between">
              <h3>Upcoming Sprints</h3>
              <Button variant="outline">Plan Next Sprint</Button>
            </div>
          </CardHeader>
          <CardContent className="task transition-all cursor-pointer  px-6 pb-6 space-y-3">
            <div className="flex justify-between items-center rounded-lg p-4 border hover:border-primary hover:bg-primary/5 mb-3 ">
              <div className="flex  justify-between items-center gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                  <Zap className="size-5 text-muted-foreground" />
                </div>
                <div className="">
                  <h3 className="font-medium">Sprint 4: Advanced Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Starts Feb 4, 2026
                  </p>
                </div>
              </div>

              <Button className="bg-transparent hover:bg-transparent">
                <ArrowRight className="size-4 " />
              </Button>
            </div>
            <div className="flex justify-between items-center rounded-lg p-4 border hover:border-primary hover:bg-primary/5 ">
              <div className="flex  justify-between items-center gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                  <Zap className="size-5  text-muted-foreground" />
                </div>
                <div className="">
                  <h3 className="font-medium">
                    Sprint 5: Testing & Refinement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Starts Feb 18, 2026
                  </p>
                </div>
              </div>

              <Button className="bg-transparent hover:bg-transparent">
                <ArrowRight className="size-4 " />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
