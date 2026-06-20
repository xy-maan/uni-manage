// app/not-found.tsx
import Link from "next/link"; 
import { Button } from "@/components/ui/button";
import { FolderX, Home } from "lucide-react";
export default function NotFound() {
  return (
  <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FolderX className="size-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
  <div className="flex gap-3 items-center">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
  </div>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            {/* <Home className="size-4 mr-2" /> */}
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
