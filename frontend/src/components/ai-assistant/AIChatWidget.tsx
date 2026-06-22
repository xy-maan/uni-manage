"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageCircle, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { AIChatWindow } from "./AIChatWindow"

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const role = session?.role

  return (
    <>
      {open && (
        <div
          className={cn(
            "fixed z-50 bottom-20 right-4 sm:right-6 w-[420px] sm:w-[480px] h-[560px] max-h-[calc(100vh-120px)]",
            "rounded-xl border bg-background shadow-2xl flex flex-col overflow-hidden",
            "max-sm:right-2 max-sm:w-[calc(100vw-16px)] max-sm:h-[calc(100vh-100px)]"
          )}
        >
          <AIChatWindow role={role} onClose={() => setOpen(false)} />
        </div>
      )}
      <Button
        onClick={() => setOpen(!open)}
        size="icon"
        className={cn(
          "fixed z-50 bottom-6 right-4 sm:right-6 size-12 rounded-full shadow-lg",
          "hover:shadow-xl transition-all duration-200"
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </>
  )
}
