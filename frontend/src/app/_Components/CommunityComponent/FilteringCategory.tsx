import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

export default function FilteringCategory() {
  return (
    <Select>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Questions">Questions</SelectItem>
                <SelectItem value="Ideas">Ideas</SelectItem>
                <SelectItem value="Help">Help</SelectItem>
                <SelectItem value="Advice">Advice</SelectItem>
                <SelectItem value="Feedback">Feedback</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
  )
}
