"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ListTree, ChevronDown, ChevronRight } from "lucide-react"
import { scrumMasterAction } from "@/Actions/ai.actions"
import type { ScrumEpic, ScrumFeature, ScrumTask } from "@/types/ai"

export function ScrumMaster() {
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [epics, setEpics] = useState<ScrumEpic[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedEpics, setExpandedEpics] = useState<Set<number>>(new Set())
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())

  const toggleEpic = (i: number) => {
    setExpandedEpics(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  const toggleFeature = (key: string) => {
    setExpandedFeatures(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  const handleSubmit = async () => {
    if (description.length < 10) return
    setLoading(true)
    setError(null)
    setEpics(null)
    const { payload, ok } = await scrumMasterAction({ project_description: description })
    if (ok && payload) {
      setEpics(payload.epics)
    } else {
      setError("Failed to generate breakdown. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Break down your project into epics, features, tasks, and subtasks.
      </p>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your project in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading || description.length < 10} className="w-full">
        {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Generating...</> : <><ListTree className="size-4 mr-2" /> Generate Breakdown</>}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {epics && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {epics.map((epic, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <button onClick={() => toggleEpic(i)} className="flex items-center gap-2 w-full text-left">
                  {expandedEpics.has(i) ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
                  <div>
                    <span className="font-semibold text-sm">{epic.name}</span>
                    <p className="text-xs text-muted-foreground">{epic.description}</p>
                  </div>
                </button>
                {expandedEpics.has(i) && epic.features?.map((feat, j) => {
                  const featKey = `${i}-${j}`
                  return (
                    <div key={featKey} className="ml-6 mt-2 border-l-2 border-muted pl-3">
                      <button onClick={() => toggleFeature(featKey)} className="flex items-center gap-2 w-full text-left">
                        {expandedFeatures.has(featKey) ? <ChevronDown className="size-3 shrink-0" /> : <ChevronRight className="size-3 shrink-0" />}
                        <span className="text-sm font-medium">{feat.name}</span>
                      </button>
                      {expandedFeatures.has(featKey) && feat.tasks?.map((task, k) => (
                        <div key={k} className="ml-4 mt-2 border-l-2 border-muted pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{task.title}</span>
                            <Badge variant={task.priority === "urgent" ? "destructive" : task.priority === "high" ? "secondary" : "outline"} className="text-[10px]">
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{task.description}</p>
                          <span className="text-xs text-muted-foreground">{task.estimated_hours}h estimated</span>
                          {task.subtasks?.map((sub, l) => (
                            <div key={l} className="ml-3 mt-1 text-xs text-muted-foreground">
                              • {sub.title}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
