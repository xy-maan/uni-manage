"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { chatAction } from "@/Actions/ai.actions"
import { AIMessage } from "./AIMessage"
import { ProjectMatchmaker } from "./features/ProjectMatchmaker"
import { ScrumMaster } from "./features/ScrumMaster"
import { ProposalRefiner } from "./features/ProposalRefiner"
import { TechStackAdvisor } from "./features/TechStackAdvisor"
import { QAGenerator } from "./features/QAGenerator"
import type { ChatMessage, AITool } from "@/types/ai"

interface AIChatWindowProps {
  role: string | null | undefined
  onClose: () => void
}

const STUDENT_TOOLS: { value: AITool; label: string }[] = [
  { value: "chat", label: "Chat" },
  { value: "matchmaker", label: "Matchmaker" },
  { value: "scrum", label: "Scrum Master" },
  { value: "proposal", label: "Proposal" },
  { value: "techstack", label: "Tech Stack" },
  { value: "qa", label: "QA" },
]

const SUPERVISOR_TOOLS: { value: AITool; label: string }[] = [
  { value: "chat", label: "Chat" },
]

export function AIChatWindow({ role, onClose }: AIChatWindowProps) {
  const tools = role === "STUDENT" ? STUDENT_TOOLS : SUPERVISOR_TOOLS
  const [activeTool, setActiveTool] = useState<AITool>("chat")
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you with your project today?" },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    const userMsg: ChatMessage = { role: "user", content: text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setSending(true)
    const { payload, ok } = await chatAction({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
    if (ok && payload) {
      setMessages(prev => [...prev, { role: "assistant", content: payload.message }])
    } else {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    }
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <Tabs value={activeTool} onValueChange={(v) => setActiveTool(v as AITool)} className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b px-3 py-2">
          <ScrollArea className="max-w-full">
            <TabsList className="inline-flex h-auto gap-1 bg-transparent p-0">
              {tools.map(tool => (
                <TabsTrigger
                  key={tool.value}
                  value={tool.value}
                  className="text-xs px-2.5 py-1.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tool.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        <div className="flex-1 overflow-hidden p-3">
          {activeTool === "chat" && (
            <div className="flex flex-col h-full">
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto mb-3 pr-1">
                {messages.map((msg, i) => (
                  <AIMessage key={i} message={msg} />
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Sparkles className="size-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                      <span className="flex gap-1">
                        <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend} disabled={sending || !input.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          )}
          {activeTool === "matchmaker" && role === "STUDENT" && <ProjectMatchmaker />}
          {activeTool === "scrum" && role === "STUDENT" && <ScrumMaster />}
          {activeTool === "proposal" && role === "STUDENT" && <ProposalRefiner />}
          {activeTool === "techstack" && role === "STUDENT" && <TechStackAdvisor />}
          {activeTool === "qa" && role === "STUDENT" && <QAGenerator />}
        </div>
      </Tabs>
    </div>
  )
}
