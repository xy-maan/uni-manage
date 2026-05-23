"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export default function FirstStep() {
  const formObj = useForm({});

  const { control, handleSubmit } = formObj;
  return (
    <Form {...formObj}>
      <form className="">
        <div className="space-y-6">
          <div className="">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="my-2 w-full">
                  <div className="flex justify-between items-center">
                    <FormLabel>Team Name *</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g., Innovation Squad, Code Warriors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Choose a unique and memorable name for your team
            </p>
          </div>

          <div className="">
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem className="my-2 w-full">
                  <div className="gap-2">
                    <FormLabel>Team Description</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      placeholder="Describe your team's goals, interests, and what you're looking to achieve..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Help others understand what your team is about
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
}
