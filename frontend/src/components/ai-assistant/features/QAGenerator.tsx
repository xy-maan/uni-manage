"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, HelpCircle } from "lucide-react"
import { qaGeneratorAction } from "@/Actions/ai.actions"
import type { QAQuestion } from "@/types/ai"

export function QAGenerator() {
  const [projectId, setProjectId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ easy: QAQuestion[]; medium: QAQuestion[]; hard: QAQuestion[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    setResult(null)
    const { payload, ok } = await qaGeneratorAction({ project_id: Number(projectId) })
    if (ok && payload) {
      setResult(payload)
    } else {
      setError("Failed to generate questions. Please check the project ID and try again.")
    }
    setLoading(false)
  }

  const renderQuestions = (questions: QAQuestion[]) => (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <div className="flex items-start gap-2 mb-1">
              <Badge variant="outline" className="shrink-0 size-6 rounded-full p-0 flex items-center justify-center">{i + 1}</Badge>
              <div>
                <p className="text-sm font-medium">{q.question}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">{q.category}</Badge>
              </div>
            </div>
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Show answer</summary>
              <p className="text-sm text-muted-foreground mt-1 pl-2 border-l-2 border-muted">{q.answer}</p>
            </details>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Generate defense questions based on your project data.
      </p>
      <div className="space-y-2">
        <Label htmlFor="project-id">Project ID</Label>
        <Input
          id="project-id"
          type="number"
          placeholder="Enter your project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading || !projectId} className="w-full">
        {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Generating...</> : <><HelpCircle className="size-4 mr-2" /> Generate Questions</>}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <Tabs defaultValue="easy" className="max-h-[400px] overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="easy">Easy ({result.easy.length})</TabsTrigger>
            <TabsTrigger value="medium">Medium ({result.medium.length})</TabsTrigger>
            <TabsTrigger value="hard">Hard ({result.hard.length})</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto mt-3 pr-1">
            <TabsContent value="easy">{renderQuestions(result.easy)}</TabsContent>
            <TabsContent value="medium">{renderQuestions(result.medium)}</TabsContent>
            <TabsContent value="hard">{renderQuestions(result.hard)}</TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  )
}
