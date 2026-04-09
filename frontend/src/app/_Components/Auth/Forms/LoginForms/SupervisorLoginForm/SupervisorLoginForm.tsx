'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

import { Input } from "@/components/ui/input"
import { useForm,Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planType, schema } from '@/schemas/AuthSchema/Auth.schema'
import ForgetPassword from '@/app/(auth)/ForgetPassword/page'
import { Checkbox } from '@/components/ui/checkbox'
import RememberMeField from '../../../RememberMeField/RememberMeField'
export default function SupervisorLoginForm() {
  const plans:planType[] = [
  {
    id: "Professor",
    title: "Primary Supervisor",
    recommended: true,
    ta: true
  },
  {
    id: "Assistant",
    title: "Assistant Supervisor",
    recommended: false
  },
] as const
    const formObj=useForm({
    resolver:zodResolver(schema)
  });
  const {control,handleSubmit, formState:{isSubmitting,isValid}}=formObj
  const selectedPlan = formObj.watch("plan")
  async function  handleRegister(){
  }

  return (
    <>

      <Form {...formObj} >
 <form className='space-y-4' onSubmit={handleSubmit(handleRegister)} >
    <div className="p-4 rounded-lg bg-muted/30">
    <FieldSet className=''>
      <FieldLegend className=' text-sm font-medium flex flex-col gap-2 leading-none data-[variant=legend]:text-sm'>Select Your Role</FieldLegend>
      <RadioGroup
        name="name"
        className='gap-2 rounded-lg mb-4'
      >
        {plans.map((plan) => (
          <FieldLabel key={plan.id} htmlFor={`form-rhf-radiogroup-${plan.id}`} className="border-0  
has-data-[state=checked]:border-none
has-[>[data-slot=field]]:rounded-none 
has-[>[data-slot=field]]:border-0
[&>*]:data-[slot=field]:p-0
has-data-[state=checked]:bg-transparent
has-[[data-slot=field]]:bg-transparent
 dark:has-data-[state=checked]:bg-transparent
  ">
            <Field orientation="horizontal" className='focus:outline-none focus-visible:ring-0'>
                 <RadioGroupItem
                value={plan.id}
                id={`form-rhf-radiogroup-${plan.id}`}
              />
              <FieldContent >
<div className="flex items-center gap-2 ">
    <FieldTitle className='leading-0 font-normal'>{plan.title}</FieldTitle>

    {plan.recommended && (
      <span className="text-xs px-2 py-0.5 rounded-md bg-muted/30 text-primary font-medium">
        Professor
      </span>
    )} 
    {!plan.recommended && (
      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 font-medium text-secondary">
        TA
      </span>
    )} 

   

  </div>
              </FieldContent>
           
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
</div>

   <FormField
    control={control}
    name="email"
    render={({field}) => (
      <FormItem  className='block space-y-2'>
        <FormLabel className='text-foreground text-sm font-medium mb-2' >Email</FormLabel>
        <FormControl>
       <Input {...field} type='email' placeholder='supervisor@university.edu'/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
     <FormField
      control={control}
      name="password"
      render={({field}) => (
        <FormItem  className=' block space-y-2'>
          <FormLabel className='text-foreground text-sm font-medium' >Password</FormLabel>
          <FormControl>
         <Input {...field} type='password' placeholder='••••••••'/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
 <div className="flex items-center justify-between">
<RememberMeField/>

</div>
   <Button type='submit' className='mb-4 w-full cursor-pointer btn'>Sign In As Supervisor</Button>
 </form>
</Form>
    </>
  )
}
