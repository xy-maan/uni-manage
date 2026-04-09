"use client"
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'

export default function RememberMeField() {
  return (
    <>
        <div className="">
         <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" className='gap-1.5 group'>
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic"  className=
        {cn("size-3.25 border-[#858585] dark:bg-[#3B3B3B] hover:border-muted-foreground data-[state=checked]:border-border data-[state=checked]:bg-[#617884]! data-[state=checked]:rounded-none [&_svg]:size-2.5 [&_svg]:stroke-5 flex items-center justify-center pl-px    group-hover:data-[state=checked]:bg-muted! transition-all duration-200"
              )}
       />
        <FieldLabel htmlFor="terms-checkbox-basic" className='text-sm border-border font-normal cursor-pointer'>
        Remember me
        </FieldLabel>
      </Field>
    </FieldGroup>
    </div>
  <Link href="/ForgetPassword">
  <h5 className='text-sm text-primary hover:underline cursor-pointer'>Forget password</h5>
  </Link>
    </>
  )
}
