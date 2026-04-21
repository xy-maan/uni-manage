"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CommunityCard from "../CommunityCard";
import CreatePost from "../CreatePost/CreatePost";
export default function Community() {
  return (
    <div>
      {/* search & select filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
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
                className=" p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md  px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
                placeholder="Search posts, topics, or tags..."
                required
              />
            </div>
          </form>
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
        </div>
      </div>
      {/* card uni */}
      <div className="text-card-foreground rounded-xl border border-primary/20 bg-primary/5 my-6">
        <div className="pb-6 p-4">
          <div className="flex items-start gap-3">
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
              className="lucide lucide-lock h-5 w-5 text-primary flex-shrink-0 mt-0.5"
            >
              <rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-1">
                Fayoum University Community
              </h3>
              <p className="text-xs text-muted-foreground">
                Private space for Fayoum University students and supervisors.
                Discuss university-specific topics, get targeted advice, and
                collaborate with your peers.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* number of posts */}
          <div className="flex items-center justify-between mb-6"><p  className="text-sm text-muted-foreground">4 Posts</p></div>
          {/* community post  */}
      <CommunityCard/>
      <CommunityCard/>
    </div>
  );
}
