"use client";
import { DownvotePostAction } from "@/Actions/downvoted.action";
import { GetPostAction } from "@/Actions/getAllPost.action";
import { UpvotePostAction } from "@/Actions/upvotePost.action";
import { Button } from "@/components/ui/button";
import { PostItem, PostItems } from "@/types/getPosts";
import { Category, Tag } from "@/types/post";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import React, {  useState } from "react";
import { toast } from "sonner";
import CommentBtn from "./CommentBtn";
import HeaderContent from "./HeaderContent";
import PollOptions from "./PollOptions";
import Image from "next/image";

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
  const category = categories.find((c) => c.id === post.category);
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
                

{post.attachments?.length > 0 && (
  <div className="mt-2 flex flex-col gap-2">
    {post.attachments.map((item) => {
     const isImage = item.file.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i);
      return (
        <div key={item.id}>
          {isImage ? (
              <Image
              width={450}
              height={450}
                src={item.file}
                alt="attachment"
                className="size-40 object-cover rounded-md"
              />
          ) : (
            <Link
              href={item.file}
              target="_blank"
              className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-sm w-fit my-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              </svg>
              Open File
            </Link>
          )}
        </div>
      );
    })}
  </div>
)}
                </div>
                
              )}
              {post.post_type === "POLL" && post.poll_options.length > 0 && (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-thumbs-up size-4 ${
                  hasUpvoted
                    ? "text-primary"
                    : "hover:text-primary text-muted-foreground"
                } `}
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>

              <span className="ms-0.5">{upvote}</span>
            </div>
            <CommentBtn postId={post.id} comments_count={post.comments_count} />
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up h-4 w-4"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>

              <span>40 views</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit bg-success/10 text-success hover:bg-success/20 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-check h-3 w-3"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Answered
            </span>
            <Button
              className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md px-3"
              onClick={handleShare}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share2 lucide-share-2 h-4 w-4"
              >
                <circle cx={18} cy={5} r={3} />
                <circle cx={6} cy={12} r={3} />
                <circle cx={18} cy={19} r={3} />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
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
