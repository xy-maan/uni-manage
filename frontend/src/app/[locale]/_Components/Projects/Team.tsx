"use client";
import React from "react";
import { Control, useForm, UseFormWatch } from "react-hook-form";
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
import { createProjectValues } from "@/types/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Code, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MultiSelect from "../Auth/Forms/TagsSearch/MultiSelect";

export default function Team({
  control,watch
}: {
  control: Control<createProjectValues>;
  watch: UseFormWatch<createProjectValues>;
}) {
    const minMembers = watch("min_members");
const maxMembers = watch("max_members");
  return (
    <div className="space-y-5 py-2">
<Card className="p-0">
    <CardContent className="p-5 space-y-5 pb-6">
<FormLabel className="mb-3 block text-sm leading-none font-medium">Team Size</FormLabel>
<div className="grid grid-cols-2 gap-6">
<FormField
  control={control}
  name="min_members"
  render={({ field }) => {
    const value = field.value ?? 5;

    return (
      <FormItem className="gap-0">
        <FormLabel className="text-xs text-muted-foreground mb-2">
          Minimum Members
        </FormLabel>

        <FormControl>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
       disabled={value <= 5}  
onClick={() => field.onChange(value - 1)}
            >
              -
            </Button>

            <span className="w-6 text-center font-semibold text-foreground">
              {value}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={value >= maxMembers}
              onClick={() => field.onChange(value + 1)}
            >
              +
            </Button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
<FormField
  control={control}
  name="max_members"
  render={({ field }) => {
    const value = field.value ;

    return (
      <FormItem className="gap-0">
        <FormLabel className="text-xs text-muted-foreground mb-2">
          Maximum Members
        </FormLabel>

        <FormControl>
          <div className="flex items-center gap-3">
        <Button
  type="button"
  variant="outline"
  size="icon"
disabled={field.value <= minMembers}  
onClick={() => field.onChange((field.value ?? minMembers) - 1)}
>
  -
</Button>

            <span className="w-6 text-center font-semibold text-foreground">
              {value}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={value >= 7}
              onClick={() => field.onChange(value + 1)}
            >
              +
            </Button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
</div>
<Separator/>
     <FormField
            control={control}
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <FormLabel><Globe className="size-4 text-primary"/>Public Project</FormLabel>
                  <p className="text-xs text-muted-foreground">
                   Visible in Browse Projects. Students can send join requests.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
  control={control}
  name="archive_tags"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-foreground text-sm font-medium">
        Skills * (Select at least 3)</FormLabel>
      <FormControl>
        <MultiSelect
          variant="student"
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
    </CardContent>
</Card>
<Card className=" border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10 p-0">
    <CardContent className="p-4 pb-6">
<p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
    Graduation Project: You'll need to request a primary supervisor (Doctor) before you can activate this project. You can send supervisor requests from the Supervision tab after creation.
</p>
    </CardContent>
</Card>
    </div>
  )
}
