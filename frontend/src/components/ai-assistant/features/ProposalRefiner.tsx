"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, AlertTriangle, ThumbsUp } from "lucide-react"
import { proposalRefinerAction } from "@/Actions/ai.actions"

export function ProposalRefiner() {
  const [proposal, setProposal] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ improved_proposal: string; weaknesses: string[]; recommendations: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (proposal.length < 20) return
    setLoading(true)
    setError(null)
    setResult(null)
    const { payload, ok } = await proposalRefinerAction({ proposal })
    if (ok && payload) {
      setResult(payload)
    } else {
      setError("Failed to refine proposal. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Improve your project proposal with academic language and clear structure.
      </p>
      <div className="space-y-2">
        <Textarea
          placeholder="Paste your project proposal here..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          rows={5}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading || proposal.length < 20} className="w-full">
        {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Refining...</> : <><FileText className="size-4 mr-2" /> Refine Proposal</>}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2"><FileText className="size-4" /> Improved Proposal</h4>
              <div className="text-sm whitespace-pre-wrap text-muted-foreground">{result.improved_proposal}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle className="size-4 text-destructive" /> Weaknesses</h4>
              <ul className="space-y-1">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Badge variant="destructive" className="size-5 rounded-full p-0 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</Badge>
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2"><ThumbsUp className="size-4 text-primary" /> Recommendations</h4>
              <ul className="space-y-1">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Badge className="size-5 rounded-full p-0 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</Badge>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
