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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
// import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '@/components/ui/field'
export default function RegisterSupervisor() {
  const plans:planType[] = [
  {
    id: "Professor",
    title: "Primary Supervisor (Professor)",
    description: "Final approval authority, project evaluation & grading, high-level feedback",
    recommended: true,
  },
  {
    id: "Assistant",
    title: "Assistant Supervisor (Teaching Assistant)",
    description: "Daily follow-ups, task reviews & guidance, communication support",
    recommended: false
  },
] as const
    const formObj=useForm({
    resolver:zodResolver(schema)
  });
  const {control,handleSubmit, formState:{isSubmitting,isValid}}=formObj
  const selectedPlan = formObj.watch("plan")
  async function  handleRegister(){
  
  // const res=await RegisterAction(data)
  // if(res.message=="success"){
      // toast.success("Your Register Successed",{position:"top-center",duration:2000})
      // router.push("/login")
  // }
  // else{
      // toast.error(res.message,{position:"top-center",duration:2000})
    // }
    // setIsLoading(false)
  }

  return (
    <>

      <Form {...formObj} >
 <form className=''onSubmit={handleSubmit(handleRegister)} >
<div className=" p-4 bg-muted/30 rounded-lg">


      <FieldSet>
      <FieldLegend>Supervisor Role</FieldLegend>
      <RadioGroup
        name="name"
       
      >
        {plans.map((plan) => (
          <FieldLabel key={plan.id} htmlFor={`form-rhf-radiogroup-${plan.id}`} className="border-secondary/20 bg-secondary/5
  has-data-[state=checked]:border-primary/20
has-data-[state=checked]:bg-primary/5

  ">
            <Field orientation="horizontal" className='focus:outline-none focus-visible:ring-0'>
                 <RadioGroupItem
                value={plan.id}
                id={`form-rhf-radiogroup-${plan.id}`}
                // aria-invalid={fieldState.invalid}
              />
              <FieldContent>
<div className="flex items-center gap-2">
    <FieldTitle>{plan.title}</FieldTitle>

    {plan.recommended && (
      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
        Recommended
      </span>
    )}
  </div>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
           
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
    </FieldSet>
</div>
<div className="grid md:grid-cols-2 gap-4 items-start justify-center">
     <FormField
    control={control}
    name="name"
    render={({field}) => (
      <FormItem className=''>
        <FormLabel className='text-foreground text-sm font-medium'>Full Name</FormLabel>
        <FormControl>
       <Input {...field} type='text'
        placeholder={
selectedPlan==="Professor"?"Dr. Jane Smith":"Jane Smith"
        }
        />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
   <FormField
    control={control}
    name="email"
    render={({field}) => (
      <FormItem  className=''>
        <FormLabel className='text-foreground text-sm font-medium' >Email</FormLabel>
        <FormControl>
       <Input {...field} type='email' placeholder='supervisor@university.edu'/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
   <FormField
    control={control}
    name="password"
    render={({field}) => (
      <FormItem  className='my-5'>
        <FormLabel className='text-foreground text-sm font-medium' >Password</FormLabel>
        <FormControl>
       <Input {...field} type='password' placeholder='••••••••'/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
       <FormField
    control={control}
    name="phone"
    render={({field}) => (
      <FormItem  className=''>
        <FormLabel className='text-foreground text-sm font-medium' >Department</FormLabel>
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
          <SelectItem value="computer science">Computer Science</SelectItem>
          <SelectItem value="software engineering">Engineering</SelectItem>
          <SelectItem value="data science"> Science</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
    <FormField
    control={control}
    name="expertise"
    render={({field}) => (
      <FormItem  className='my-5 w-full'>
        <FormLabel className='text-foreground text-sm font-medium' >Areas of Expertise</FormLabel>
         <InputGroup className='w-full'>
                    <InputGroupTextarea
                      {...field}
                      id=""
                      placeholder="Machine Learning, Software Architecture, Data Analysis..."
                      rows={3}
                      className=" resize-none w-full"
                      // aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
        <FormMessage />
      </FormItem>
    )}
  />
   <Button type='submit' className='my-4 w-full cursor-pointer btn'>Create Primary Supervisor Account</Button>
 </form>
</Form>
    </>
  )
}
