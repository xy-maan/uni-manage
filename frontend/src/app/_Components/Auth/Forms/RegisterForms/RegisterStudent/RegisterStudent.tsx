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
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '@/schemas/AuthSchema/Auth.schema'
export default function RegisterStudent() {
  const formObj=useForm({
  resolver:zodResolver(schema)
});
const {control,handleSubmit, formState:{isSubmitting,isValid}}=formObj
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
<div className="grid md:grid-cols-2 gap-4 items-start justify-center">
     <FormField
    control={control}
    name="name"
    render={({field}) => (
      <FormItem className=''>
        <FormLabel className='text-foreground text-sm font-medium'>Full Name</FormLabel>
        <FormControl>
       <Input {...field} type='text' placeholder='Dr. Jane Smith'/>
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
   {/* <FormField
    control={control}
    name="rePassword"
    render={({field}) => (
      <FormItem  className='my-5'>
        <FormLabel className='text-foreground text-sm font-medium' >Enter RePassword</FormLabel>
        <FormControl>
       <Input {...field} type='password' placeholder='Dr. Jane Smith'/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  /> */}
<div className="grid md:grid-cols-2 gap-4">
       <FormField
    control={control}
    name="phone"
    render={({field}) => (
      <FormItem  className=''>
        <FormLabel className='text-foreground text-sm font-medium' >Major</FormLabel>
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
          <SelectItem value="software engineering">Software Engineering</SelectItem>
          <SelectItem value="artificial intelligence">Artificial Intelligence</SelectItem>
          <SelectItem value="data science">Data Science</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
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
    name="phone"
    render={({field}) => (
      <FormItem  className=''>
        <FormLabel className='text-foreground text-sm font-medium' >Academic Level</FormLabel>
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
          <SelectValue placeholder="Select Level"/>
        </SelectTrigger>
         <SelectContent position="item-aligned">
          <SelectItem value="freshman">Freshman</SelectItem>
          <SelectItem value="sophomore">sophomore</SelectItem>
          <SelectItem value="junior">Junior</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
          <SelectItem value="graduate">Graduate</SelectItem>
        </SelectContent>
     
      </Select>
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
      <FormItem  className='my-5 w-full'>
        <FormLabel className='text-foreground text-sm font-medium' >Description</FormLabel>
         <InputGroup className='w-full'>
                    <InputGroupTextarea
                      {...field}
                      id=""
                      placeholder="React, Python, Machine Learning, UI/UX Design..."
                      rows={3}
                      className=" resize-none w-full"
                      // aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
        <FormMessage />
      </FormItem>
    )}
  />
   <Button type='submit' className='my-4 w-full cursor-pointer btn'>Create Student Account</Button>
 </form>
</Form>

    </>
  )
}
