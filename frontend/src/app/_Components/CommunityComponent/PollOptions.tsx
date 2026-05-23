"use client";
import { useEffect, useState } from "react";
import { PollOption } from "@/types/getPosts";
import { VotePollAction } from "@/Actions/votePoll.action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function PollOptions({
  postId,
  options,
}: {
  postId: number;
  options: PollOption[];
}) {
  const [pollOptions, setPollOptions] = useState(options);  
  const hasVoted = pollOptions.find((o) => o.has_voted);
  const totalVotes = pollOptions.reduce((sum, o) => sum + o.vote_count, 0);
  async function handleVote(optionId: number) {
    if (hasVoted) return;
    const { ok, payload } = await VotePollAction(postId, optionId);
    console.log(payload);

    if (!ok)
      toast.error(payload.detail, { position: "top-center", duration: 2000 });
    setPollOptions((prev) =>
      prev.map((o) =>
        o.id == optionId
          ? { ...o, vote_count: o.vote_count + 1, has_voted: true }
          : o,
      ),
    );
  }
  function getPercentage(voteCount: number, total: number) {
    if (!total) return 0;
    return Math.round((voteCount / total) * 100);
  }
  const [animated, setAnimated] = useState(false);

useEffect(() => {
  setTimeout(() => setAnimated(true), 100);
}, []);
  return (
    <div className="space-y-2 mt-3 md:w-1/3 w-full">
      {pollOptions.map((option) => 
          <div
            key={option.id}
            onClick={() => handleVote(option.id)}
            className={`relative rounded-lg border p-3 cursor-pointer  transition-all overflow-hidden
              ${option.has_voted ? "border-primary bg-primary/5" : "hover:border-primary/50"}
              ${hasVoted ? "cursor-default" : "cursor-pointer"}
            `}
          >
            <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-700"   style={{ width: animated ? `${getPercentage(option.vote_count, totalVotes)}%` : "0%" }}/>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`size-4 rounded-full border-2 flex items-center justify-center
                  ${option.has_voted ? "border-primary" : "border-muted-foreground"}
                `}
                >
                  {option.has_voted && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </span>
                <span className="text-sm font-medium">{option.text}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {getPercentage(option.vote_count, totalVotes)}%
              </span>
            </div>
          </div>
      )}
      <p className="text-xs text-muted-foreground my-3">
        {totalVotes} votes total
      </p>
    </div>
  );
}
