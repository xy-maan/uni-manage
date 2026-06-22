"use client"
import { GetCategoryAction } from '@/Actions/getCategory.action';
import { CommunityContext } from '@/app/Providers/FilteringCategoryProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/types/post';
import React, { useContext, useEffect, useState } from 'react'

export default function FilteringCategory() {
  const context = useContext(CommunityContext);
  if (!context) throw new Error("Not Exit");
  const{setSelectedCategory}=context
    const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function getCategories() {
      const { ok, payload } = await GetCategoryAction();
      
      if (ok) setCategories(payload);
    }
    getCategories();
  }, []);

  return (
    <Select onValueChange={(value) => setSelectedCategory(value == "all" ? null : Number(value))}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                 <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
          ))}
              </SelectGroup>
            </SelectContent>
          </Select>

  )
}
