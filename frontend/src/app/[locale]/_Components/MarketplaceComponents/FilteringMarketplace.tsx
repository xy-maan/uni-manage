"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Category, Technology } from '@/types/marketplace';
import React, { useEffect, useState } from 'react'
import { getCategoriesAction } from '@/Actions/getCategories.action';
import { getTechnologiesAction } from '@/Actions/getTechnologies.action';

interface FilteringMarketplaceProps {
  filters: {
    search: string;
    category: string;
    technology: string;
    project_type: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function FilteringMarketplace({ filters, onFilterChange }: FilteringMarketplaceProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  useEffect(() => {
    async function loadData() {
      const [catRes, techRes] = await Promise.all([
        getCategoriesAction(),
        getTechnologiesAction(),
      ]);
      if (catRes.ok) setCategories(catRes.payload);
      if (techRes.ok) setTechnologies(techRes.payload);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <InputGroup className="flex-1">
        <InputGroupInput
          placeholder="Search projects, technologies, or keywords..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        <InputGroupAddon className="pr-1">
          <Search className="" />
        </InputGroupAddon>
      </InputGroup>

      <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
        <SelectTrigger className="w-full lg:w-50 text-foreground">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="text-foreground">
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={filters.technology} onValueChange={(value) => onFilterChange('technology', value)}>
        <SelectTrigger className="w-full lg:w-50 text-foreground">
          <SelectValue placeholder="All Technologies" />
        </SelectTrigger>
        <SelectContent className="text-foreground">
          <SelectGroup>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map((t) => (
              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={filters.project_type} onValueChange={(value) => onFilterChange('project_type', value)}>
        <SelectTrigger className="w-full lg:w-45 text-foreground">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent className='text-foreground'>
          <SelectGroup>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="graduation">Graduation Projects</SelectItem>
            <SelectItem value="course">Course Projects</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
