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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schemas/AuthSchema/Auth.schema";
export default function RegisterStudent() {
  const formObj = useForm({
    resolver: zodResolver(schema),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formObj;
  async function handleRegister(data:any) {
     console.log("🔥 submit fired");
    // const res=await RegisterAction(data)
    // if(res.message=="success"){
    // toast.success("Your Register Successed",{position:"top-center",duration:2000})
    // router.push("/login")
    // }
    // else{
    // toast.error(res.message,{position:"top-center",duration:2000})
    // }
    // setIsLoading(false)
     const formattedData = {
    ...data,
    skills: data.skills
      ?.split(",")             
      .map((s: string) => s.trim()) 
      .filter((s: string) => s !== ""), 
    };
    console.log(typeof formattedData.skills);
console.log(Array.isArray(formattedData.skills));

  console.log(formattedData);
  }
  return (
    <>
      <Form {...formObj}>
        <form className="" onSubmit={handleSubmit(handleRegister)}>
          <FormField
            control={control}
            name="major"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Major
                </FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      // aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select Major" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Software Engineering">
                        Software Engineering
                      </SelectItem>
                      <SelectItem value="Artificial Intelligence">
                        Artificial Intelligence
                      </SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="academic_level"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Academic Level
                </FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      // aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gpa"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  GPA
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    placeholder="3.8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="skills"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Skills
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. React, Python, Django"
                      {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="my-4 w-full cursor-pointer btn">
            Create Student Account
          </Button>
        </form>
      </Form>
    </>
  );
}
