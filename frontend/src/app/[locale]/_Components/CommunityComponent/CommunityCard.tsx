"use client";
import { DownvotePostAction } from "@/Actions/downvoted.action";
import { GetPostAction } from "@/Actions/getAllPost.action";
import { UpvotePostAction } from "@/Actions/upvotePost.action";
import { Button } from "@/components/ui/button";
import { PostItem, PostItems } from "@/types/getPosts";
import { Category, Tag } from "@/types/post";
import { Link } from '@/i18n/navigation';
import { formatDistanceToNow } from "date-fns";
import React, {  useState } from "react";
import { toast } from "sonner";
import CommentBtn from "./CommentBtn";
import HeaderContent from "./HeaderContent";
import PollOptions from "./PollOptions";
import Image from "next/image";
import { Check, CircleCheck, Share2, ThumbsUp, TrendingUp } from "lucide-react";
import AttachmentViewer from "./AttachmentViewer/AttachmentViewer";

export default function CommunityCard({
  post,
  categories,
}: {
  post: PostItem;
  categories: Category[];
}) {
  const [upvote, setUpvote] = useState<number | undefined>(post.upvotes_count);
  const [hasDownvoted, setHasDownvoted] = useState<boolean | undefined>(
    post.has_downvoted,
  );
  const [hasUpvoted, setHasUpvoted] = useState<boolean | undefined>(
    post.has_upvoted,
  );
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });
  async function handleVote() {
    if (hasUpvoted) {
      const { payload, ok } = await DownvotePostAction(post.id);
      if (!ok) {
        toast.error("failed");
        return;
      }
      setUpvote(payload?.upvotes_count);
      setHasUpvoted(false);
      setHasDownvoted(payload?.has_downvoted);
    } else {
      const { payload, ok } = await UpvotePostAction(post.id);
      if (!ok) {
        toast.error("failed");
        return;
      }
      setUpvote(payload?.upvotes_count);
      setHasUpvoted(payload?.has_upvoted);
      setHasDownvoted(false);
    }
  }
  async function handleShare() {
    const postUrl = `${window.location.origin}/community/${post.id}`;
    await navigator.clipboard.writeText(postUrl);
    toast.success("Post Shared!", { position: "top-center", duration: 2000 });
  }
  const category = categories.find((c) => c.id == post.category);
  return (
    <div className="card bg-card mb-4 text-card-foreground flex flex-col gap-3 rounded-xl border hover:shadow-md transition-shadow">
      <div className="header  gap-1.5 px-6 pt-6  pb-3">
          <div className="flex items-start  gap-4 flex-col">
            <HeaderContent
              name={post.author_username}
              role={post.author_role}
              createdAt={post.created_at.toString()}
              category={category}
            />

            <div className="flex flex-col flex-1 items-start w-full">
              {" "}
        <Link href={`/${post.author_role.toLowerCase()}/community/${post.id}`}>
              <h2 className="text-lg font-semibold leading-tight mb-2">
                Project Idea: {post.title}
              </h2>
               </Link>
              {post.post_type == "TEXT" && (
                <div className="">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {post.content}
                </p>
                
<AttachmentViewer attachments={post.attachments} />
                </div>
                
              )}
              {post.post_type == "POLL" && post.poll_options.length > 0 && (
                <PollOptions postId={post.id} options={post.poll_options} />
              )}
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit  overflow-hidden  bg-secondary text-secondary-foreground text-xs capitalize"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
       
      </div>
      <div className=" px-6 pt-0 ">
        <div className="flex items-center justify-between pt-3 border-t pb-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground ">
            <div
              className={`flex items-center gap-1.5 ${
                !hasUpvoted && "hover:text-primary"
              } transition-colors like-part`}
              onClick={handleVote}
            >
              <ThumbsUp   className={`lucide lucide-thumbs-up size-4 ${
                  hasUpvoted
                    ? "text-primary"
                    : "hover:text-primary text-muted-foreground"
                } `} />
     
              <span className="ms-0.5">{upvote}</span>
            </div>
            <CommentBtn postId={post.id} comments_count={post.comments_count} />
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <TrendingUp className="size-4"/>
           

              <span>40 views</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit bg-success/10 text-success hover:bg-success/20 gap-1">
            <CircleCheck className="size-3"/>
      
              Answered
            </span>
            <Button
              className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md px-3"
              onClick={handleShare}
            >
              <Share2 className="size-4"/>
            
              Share
            </Button>
            <Button className=" bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3">
              View Discussion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
