"use client"
import { GetCommentAction } from "@/Actions/getAllComments.action";
import { Comment } from "@/types/comments";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import HeaderContent from "./HeaderContent";
import { useQuery } from "@tanstack/react-query";
export default  function Comments({ postId }: { postId: number }) {
//   const { payload: comments } = await GetCommentAction(postId);
//   (comments);
   const { data:comments, isLoading, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async  () =>{
      const { ok, payload } = await GetCommentAction(postId);
      if (!ok) return;
      return payload;
    },
  });
  return (
    <div className="comment ">
      <div className="flex flex-col  gap-3">
        {comments?.map((comment: Comment) => (
          <div
            key={comment.id}
            className="bg-card  flex flex-col gap-6 rounded-xl border hover:shadow-md transition-shadow text-card-foreground"
          >
            <div className=" px-6 pt-6  pb-3 text-accent-foreground  flex items-start  gap-4">
<div className="flex flex-col ">
             <HeaderContent   name={comment.author_name} 
  role={comment.author_role} 
  createdAt={comment.created_at.toString()} 
  category={undefined}/>
            <p className="text-foreground text-md  line-clamp-2 mb-2"> {comment.content}</p>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
