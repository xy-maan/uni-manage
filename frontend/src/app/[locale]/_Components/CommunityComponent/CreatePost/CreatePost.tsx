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
import { Textarea } from "@/components/ui/textarea";
import { AtSign, ChartColumn, FileText, Plus, Send } from "lucide-react";
import MultiSelect from "../../Auth/Forms/TagsSearch/MultiSelect";

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
      tag_names: [],
      file: undefined,
      post_type: "TEXT",
      poll_option_texts: [{ value: "" },{value:""}]
    },
  });

  const { control, handleSubmit,formState } = formObj;
async function handleCreatePost(data: CreateTextPostValues) {
  if (switchPost == "text") {
    await handleCreatePostText(data);
  } else {
    await handleCreatePostPoll(data);
  }

}
  const queryClient = useQueryClient();
  async function handleCreatePostText(data: CreateTextPostValues) {
    const postData:CreateTextPostValues = {
      // ...data,
         title: data.title,
    content: data.content,
    category: data.category,
    tag_names: data.tag_names ?? [],
    post_type: data.post_type.toUpperCase() as "TEXT" | "POLL",
    };

    const { payload, ok } = await CreatePostAction(postData);
    (formObj.formState.errors);
    if (!ok) { toast.error("Failed to create post");  queryClient.invalidateQueries({ queryKey: ["posts"] }); return; }

    if (data.file && payload?.id) {
      await UploadFileAction(payload.id, data.file);
    }

    formObj.reset();
    setOpen(false);
    {toast.success("Post created successfully",{position:"top-center",duration:2000})}
    // queryClient.invalidateQueries({ queryKey: ["posts"] });
    await queryClient.invalidateQueries({
  queryKey: ["posts"],
});
  }
  async function handleCreatePostPoll(data: CreateTextPostValues) {
    const postData = {
...data,
   poll_option_texts: data.poll_option_texts?.map((o:any) => o.value),
          post_type: data.post_type.toUpperCase() as "TEXT" | "POLL",

    };

    const { payload, ok } = await CreatePostAction(postData);
    
    if (!ok) { toast.error("Failed to create poll");  queryClient.invalidateQueries({ queryKey: ["posts"] }); return; }

    toast.success("Poll created successfully",{position:"top-center",duration:2000});
    formObj.reset();
    setOpen(false);
    // queryClient.invalidateQueries({ queryKey: ["posts"] }); 
    await queryClient.invalidateQueries({
  queryKey: ["posts"],
});

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
     
              <Plus className="size-4"/>
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
                    <FileText className="size-4 mr-2"/>
                 
                    Text Post
                  </TabsTrigger>
                  <TabsTrigger
                    value="poll"
                    className="!text-primary-foreground flex items-center justify-center gap-1.5  data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground px-3  h-8.5 text-sm font-medium  has-[>svg]:px-2.5"
                  >
                    {" "}
                    <ChartColumn className="size-4 mr-2"/>
               
                    Poll
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-2 my-3">
                    <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem className="">
                     <FieldLabel htmlFor="category">Category *</FieldLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                      value={field.value ? field.value.toString() : ""}
                        onValueChange={(v) => field.onChange(Number(v))}>
                    
                        <SelectTrigger
                          id="categories"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                         
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
                    <div className="my-3">
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem className="my-2 w-full">
              <div className="gap-2">
                <FormLabel> Content *</FormLabel>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Share an update, ask a question, or start a discussion... (Use @ to mention users or projects)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-xs text-muted-foreground flex items-center gap-1 my-3">
          <AtSign className="size-3"/>
          Type @ to mention users or projects
        </div>
      </div>
              {switchPost == "text" && <FileUploadSection control={control} />}
              {switchPost == "poll" && <PollSection control={control} formState={formState} />}
     <div className="space-y-2 my-3">
              <FormField
  control={control}
  name="tag_names"
  render={({ field, fieldState }) => (
    <FormItem>
   <FieldLabel htmlFor="tag">Tags</FieldLabel>
      <FormControl>
        <MultiSelect
          variant="post"
          value={field.value ?? []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

              </div>
              {/* <DialogFooter> */}
              <div className="flex gap-2 pt-1 ">
                <Button type="submit" className="flex-1 cursor-pointer"  

>
  <Send className=" size-4"/>
                
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
