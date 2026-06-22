// EmptyProjectCard.tsx
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { FolderOpen, Plus, Search } from "lucide-react";

export default function EmptyProjectCard() {
  return (
    <div className="rounded-xl flex flex-col items-center justify-center mb-8 border-2 border-dashed border-primary/20 py-12 px-6 text-center">
      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <FolderOpen className="size-7 text-primary" />
      </div>
      <h3 className="font-semibold mb-1">No Active Project</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        You're not part of any project yet. Create one or find a team to join.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/student/findteam">
            <Search className="size-4 mr-2" />
            Find Team
          </Link>
        </Button>
        <Button asChild>
          <Link href="/student/projects/create">
            <Plus className="size-4 mr-2" />
            Create Project
          </Link>
        </Button>
      </div>
    </div>
  );
}