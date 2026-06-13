import { PostItem } from '@/types/getPosts'
import { Category } from '@/types/post'
import { formatDistanceToNow } from 'date-fns';
import React from 'react'
export default function HeaderContent({ 
  name, 
  role, 
  createdAt ,
  category
}: { 
  name: string; 
  role: string; 
  createdAt: string;
  category:Category|undefined
}){
      const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  return (
     <div className="flex gap-4 w-full">
            <div className="relative flex rounded-full size-10">
            <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
               {name.charAt(0).toUpperCase()|| "U"}
            </span>
          </div>
            <div className="flex  justify-between w-full  flex-1 items-start">
              <div className="flex flex-col">
                <div className="flex mb-1  items-center gap-2 flex-wrap">
                  <h2 className="font-medium capitalize">{name}</h2>
                  <span className="flex items-center capitalize justify-center rounded-md border px-2 py-0.5 font-medium w-fit   bg-secondary/10 text-primary hover:bg-primary/20 text-xs">
                    {role.toLowerCase()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mb-2">
             {timeAgo}
                </span>
              </div>
              <span className="flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit gap-1 bg-secondary/10 text-secondary hover:bg-secondary/20">
                {" "}
           {category?.name}
              </span>
            </div>
          </div>
  )
}
