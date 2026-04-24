"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadSection from "./FileUploadSection";
import PollSection from "./PollSection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostAction } from "@/Actions/createPost.action";
import { Category, Post, Tag } from "@/types/post";
import { GetCategoryAction } from "@/Actions/getCategory.action";
import { UploadFileAction } from "@/Actions/file.action";
import { toast } from "sonner";
import { CreateTextPostValues } from "@/types/schema";
import {   schemaPost } from "@/schemas/CreatePost.schema";

import {  useQueryClient } from "@tanstack/react-query";
import { GetTagsAction } from "@/Actions/getTags.action";

export default function CreatePost() {
    const [open, setOpen] = useState(false);
      const [categories, setCategories] = useState<Category[]>([]);
      const [tags, setTags] = useState<Tag[]>([]);
  const [switchPost, setSwitchPost] = useState("text");
  const formObj = useForm<CreateTextPostValues>({
    resolver:zodResolver(  schemaPost),
    defaultValues: {
      category: undefined,
      content:"",
      title: "",
      tag_names: "",
      file: undefined,
        post_type: "TEXT",
  poll_option_texts: [{ value: "" },{value:""}]
    },
  });

  const { control, handleSubmit } = formObj;
async function handleCreatePost(data: CreateTextPostValues) {
  if (switchPost === "text") {
    await handleCreatePostText(data);
  } else {
    await handleCreatePostPoll(data);
  }

}
  const queryClient = useQueryClient();
  async function handleCreatePostText(data: CreateTextPostValues) {
    const postData = {
      title: data.title,
      content: data.content,
      post_type: "TEXT",
      tag_names: data.tag_names?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
      // tag_names: Number(data.tag_names),
      category: Number(data.category),
    };

    const { payload, ok } = await CreatePostAction(postData);
    if (!ok) { toast.error("Failed to create post"); return; }

    if (data.file && payload?.id) {
      await UploadFileAction(payload.id, data.file);
    }

    {toast.success("Post created successfully",{position:"top-center",duration:2000})}
    formObj.reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  async function handleCreatePostPoll(data: CreateTextPostValues) {
    const postData = {
      title: data.title,
      category: Number(data.category),
      post_type: "POLL",
      tag_names: data.tag_names?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
      // tag_names: Number(data.tag_names),
      poll_option_texts: data.poll_option_texts?.map((o) => o.value),
    };

    const { payload, ok } = await CreatePostAction(postData);
    console.log(payload);
    
    if (!ok) { toast.error("Failed to create poll"); return; }

    toast.success("Poll created successfully",{position:"top-center",duration:2000});
    formObj.reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] }); 
  }

 async function getCategory() {
    const { ok, payload } = await GetCategoryAction();
    if (ok)
     {  setCategories(payload);}
  }
   async function getTags() {
    const { ok, payload } = await GetTagsAction();
    if (ok)
     {  setTags(payload);}
  }
useEffect(() => {
  getCategory();
  getTags()
}, []);
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center font-medium justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus h-4 w-4"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Create Post
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background overflow-y-auto sm:max-w-lg max-w-2xl max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>
              Share your ideas, ask questions, or seek advice from the community
            </DialogDescription>
          </DialogHeader>
          <Form {...formObj}>
            <form onSubmit={handleSubmit(handleCreatePost)} className="">
              <Tabs
                defaultValue="text"
                className=""
                
               onValueChange={(type) => {
  setSwitchPost(type);
  formObj.setValue("post_type", type.toUpperCase() as "TEXT" | "POLL");
}}
              >
                <TabsList className=" w-full p-0.75 flex items-center gap-2 h-auto! ">
                  <TabsTrigger
                    value="text"
                    className="!text-primary-foreground flex items-center justify-center gap-1.5  data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground px-3  h-8.5 text-sm font-medium  has-[>svg]:px-2.5 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text h-4 w-4 mr-2"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>{" "}
                    Text Post
                  </TabsTrigger>
                  <TabsTrigger
                    value="poll"
                    className="!text-primary-foreground flex items-center justify-center gap-1.5  data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground px-3  h-8.5 text-sm font-medium  has-[>svg]:px-2.5"
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chart-column h-4 w-4 mr-2"
                    >
                      <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                      <path d="M18 17V9"></path>
                      <path d="M13 17V5"></path>
                      <path d="M8 17v-3"></path>
                    </svg>{" "}
                    Poll
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-2 my-3">
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category *</FieldLabel>
                      <Select
                        name={field.name}
                         value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          id="category"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="my-3">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="my-2 w-full">
                      <div className="flex justify-between items-center">
                        <FormLabel>Title *</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="What's your post about?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {switchPost === "text" && <FileUploadSection control={control} />}
              {switchPost === "poll" && <PollSection control={control} />}
     <div className="space-y-2 my-3">
                <Controller
                  name="tag_names"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tag">Tags</FieldLabel>
                      <Select
                        name={field.name}
                         value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          id="tag"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map((t) => (
                            <SelectItem key={t.id}  value={t.name}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              {/* <DialogFooter> */}
              <div className="flex gap-2 pt-1">
                <Button type="submit" className="flex-1 cursor-pointer"  
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
                    className="lucide lucide-send h-4 w-4"
                  >
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                  Post to Community
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
              {/* </DialogFooter> */}
              <p className="text-xs text-muted-foreground text-center mt-1">
                Please fill in all required fields to post
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
