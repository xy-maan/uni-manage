"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SessionWatcher() {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (
      session?.error === "RefreshAccessTokenError" ||
      session?.error === "NoRefreshToken"
    ) {
      setShow(true);
    }
  }, [session?.error]);

  if (!show) return null;

  return (
 <Dialog open={show} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-sm bg-card"
        onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-start text-lg">
            Session Expired
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground  mb-3">
          Your session has expired. Please login again to continue where you left off.
        </p>

        <Button
        variant="outline"
          onClick={() => signIn("google", { callbackUrl: window.location.href})}
          className="w-full  "
        >
          Login Again
        </Button>
      </DialogContent>
    </Dialog>
  );
} 