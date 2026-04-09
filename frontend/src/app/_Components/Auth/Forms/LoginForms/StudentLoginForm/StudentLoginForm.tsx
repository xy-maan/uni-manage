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
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '@/schemas/AuthSchema/Auth.schema'
import  Link from 'next/link';
import ForgetPassword from './../../../../../(auth)/ForgetPassword/page';
import RememberMeField from '../../../RememberMeField/RememberMeField'
export default function StudentLoginForm() {
  const formObj=useForm({
  resolver:zodResolver(schema)
});
const {control,handleSubmit, formState:{isSubmitting,isValid}}=formObj
async function  handleLogin(){

}
  return (
    <>  
      <Form {...formObj} >
 <form className='space-y-4'onSubmit={handleSubmit(handleLogin)} >

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
        <FormLabel className='text-foreground text-sm font-medium  mb-2' >Password</FormLabel>
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
   <Button type='submit' className='mb-4 w-full cursor-pointer btn'>Sign In As Student</Button>
 </form>
</Form>

    </>
  )
}
