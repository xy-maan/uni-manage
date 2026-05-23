"use client"
import { CommunityContext } from '@/app/Providers/FilteringCategoryProvider';
import React, { useContext, useRef } from 'react'

export default function SearchInputCategory() {
      const ref=useRef<HTMLInputElement>(null)
   const context = useContext(CommunityContext);
  if (!context) throw new Error("Not Exit");
  const { search, setSearch } = context;
    function handleSearch() {
      if (ref.current) {
        setSearch(ref.current.value);
      }
    }
  return (
    <form className="flex-1">
            <label
              htmlFor="search"
              className="block mb-2.5 text-sm font-medium text-heading sr-only "
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                >
                  <circle cx={11} cy={11} r={8} />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="search"
                id="search"
          ref={ref}
          onChange={(e) => handleSearch()}
                className=" p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md  px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
                placeholder="Search posts, topics, or tags..."
                required
              
              />
            </div>
          </form>
  )
}
