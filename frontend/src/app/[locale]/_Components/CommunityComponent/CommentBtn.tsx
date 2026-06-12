"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { startTransition, useEffect, useState } from "react";
import { CreateCommentAction } from "@/Actions/createComment.action";
import { GetCommentAction } from "@/Actions/getAllComments.action";
import { Comments } from "@/types/comments";
import { commentSchema, CommentValues } from "@/schemas/Comment.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { MessageSquare } from "lucide-react";
export default function CommentBtn({
  postId,
  comments_count,
  onCommentAdded,
}: {
  postId: number;
  comments_count: number;
  onCommentAdded?: () => Promise<void>;
}) {
  const router = useRouter();
  const [comments, setComments] = useState<Comments>([]);
  const [count, setCount] = useState(comments_count);
  const [open, setOpen] = useState(false);
  const formObj = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });
  const { control, handleSubmit } = formObj;

  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: async (data: CommentValues) => {
      const { ok, payload } = await CreateCommentAction(postId, data);
      if (!ok)  toast.error("Failed");
      return payload;
    },

    onSuccess: () => {
      toast.success("Comment added!",{position:"top-center",duration:2000});
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      
      setCount((prev) => prev + 1);

      formObj.reset();
      setOpen(false);
    },

    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  function handleCreateComment(data: CommentValues) {
    mutate(data);
  }

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-transparent p-0 text-muted-foreground has-[>svg]:px-0 hover:bg-transparent">
          <MessageSquare className="size-4"/>
          
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Comment</DialogTitle>
          </DialogHeader>
          <Form {...formObj}>
            <form onSubmit={handleSubmit(handleCreateComment)}>
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-muted-foreground">
                      Comment
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Write your comment..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Post Comment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <span>{count}</span>
    </div>
  );
}
