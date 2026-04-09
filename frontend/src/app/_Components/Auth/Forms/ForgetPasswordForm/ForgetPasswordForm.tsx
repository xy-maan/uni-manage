"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schemas/AuthSchema/Auth.schema";
export default function ForgetPasswordForm() {
  const formObj = useForm({
    resolver: zodResolver(schema),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formObj;
  async function handleLogin() {}
  return (
    <Form {...formObj}>
      <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="block space-y-2">
              <FormLabel className="text-foreground text-sm font-medium mb-2">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="supervisor@university.edu"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="bg-muted/30  p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">What happens next?</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-start gap-2">
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
                className="lucide lucide-circle-check h-4 w-4 text-success mt-0.5 shrink-0 
"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              We'll send a secure link to your email
            </li>
            <li className="flex items-start gap-2">
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
                className="lucide lucide-circle-check h-4 w-4 text-success mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Click the link to create a new password
            </li>
            <li className="flex items-start gap-2">
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
                className="lucide lucide-circle-check h-4 w-4 text-success mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Link expires in 1 hour for security
            </li>
          </ul>
        </div>
        <Button type="submit" className="mb-4 w-full cursor-pointer btn flex items-center justify-center">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mt-px h-4 w-4 "><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
          Send Reset Link
        </Button>
      </form>
    </Form>
    
  );
}
