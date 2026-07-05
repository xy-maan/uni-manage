
// CardsInfoDashboard.tsx (لو الـ variant student بتستقبل props دلوقتي)
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Clock, Users, FileText } from "lucide-react";

export default function CardsInfoDashboard({
  variant,
  completedCount = 0,
  pendingCount = 0,
  teamCount = 0,
  documentsCount = 0,
}: {
  variant: string;
  completedCount?: number;
  pendingCount?: number;
  teamCount?: number;
  documentsCount?: number;
}) {
  if (variant === "student") {
    const cards = [
      { label: "Tasks Completed", value: `${completedCount}/${completedCount + pendingCount}`, icon: CircleCheck, color: "success" },
      { label: "Pending Tasks", value: pendingCount, icon: Clock, color: "warning" },
      { label: "Team Members", value: teamCount, icon: Users, color: "primary" },
      { label: "Documents", value: documentsCount, icon: FileText, color: "secondary" },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-0">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <h5 className="text-foreground/80 mb-1 font-medium text-sm">{c.label}</h5>
                <p className="text-2xl mt-1 font-semibold mb-2">{c.value}</p>
              </div>
              <div className={`rounded-xl p-3 text-${c.color} bg-${c.color}/10`}>
                <c.icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
if (variant === "supervisor") {
  const cards = [
    { label: "Tasks Completed", value: `${completedCount}/${completedCount + pendingCount}`, icon: CircleCheck, color: "success" },
    { label: "Pending Review", value: pendingCount, icon: Clock, color: "warning" },
    { label: "Total Students", value: teamCount, icon: Users, color: "primary" },
    { label: "Documents", value: documentsCount, icon: FileText, color: "secondary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((c) => (
        <Card key={c.label} className="p-0">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h5 className="text-foreground/80 mb-1 font-medium text-sm">{c.label}</h5>
              <p className="text-2xl mt-1 font-semibold mb-2">{c.value}</p>
            </div>
            <div className={`rounded-xl p-3 text-${c.color} bg-${c.color}/10`}>
              <c.icon className="size-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

  return null;
}