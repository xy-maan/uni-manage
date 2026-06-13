"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { GetCategoryAction } from '@/Actions/getCategory.action';
import { CommunityContext } from '@/app/Providers/FilteringCategoryProvider';
import { Category } from '@/types/post';
import React, { useContext, useEffect, useState } from 'react'

export default function FilteringMarketplace() {
    // const context = useContext(CommunityContext);
    // if (!context) throw new Error("Not Exit");
    // const{setSelectedCategory}=context
    //   const [categories, setCategories] = useState<Category[]>([]);
  
    // useEffect(() => {
    //   async function getCategories() {
    //     const { ok, payload } = await GetCategoryAction();        
    //     if (ok) setCategories(payload);
    //   }
    //   getCategories();
    // }, []);
  
  return (
    <div className="flex flex-col lg:flex-row gap-4">
  <InputGroup className="flex-1">
      <InputGroupInput placeholder="Search projects, technologies, or keywords..."  />
      <InputGroupAddon className="pr-1">
        <Search className="" />
      </InputGroupAddon>
    </InputGroup>
          <Select 
          //  onValueChange={(value) => setSelectedCategory(value == "all" ? null : Number(value))}
           >
            <SelectTrigger className="w-full lg:w-50 text-foreground">
              <SelectValue placeholder="All Categories" className="" />
            </SelectTrigger>
            <SelectContent className="text-foreground">
              <SelectGroup>
                 <SelectItem value="all">All Categories</SelectItem>
          {/* {categories.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
          ))} */}
              </SelectGroup>
            </SelectContent>
          </Select>
       
                <Select >
            <SelectTrigger className="w-full lg:w-45 text-foreground">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className='text-foreground'>
              <SelectGroup>
                 <SelectItem value="all">All Status</SelectItem>
          {/* {categories.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
          ))} */}
              </SelectGroup>
            </SelectContent>
          </Select>
    </div>
  )
}
