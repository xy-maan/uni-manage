"use client";
import { useContext, useEffect, useState } from "react";
import CommunityCard from "../CommunityCard";
import CreatePost from "../CreatePost/CreatePost";
import { GetPostAction } from "@/Actions/getAllPost.action";
import { GetCategoryAction } from "@/Actions/getCategory.action";
import { PostItem, PostItems } from "@/types/getPosts";
import { Category, Tag } from "@/types/post";
import { toast } from "sonner";
import PostLoading from "../PostLoading";
import { useQuery } from "@tanstack/react-query";
import { GetTagsAction } from "@/Actions/getTags.action";
import { CommunityContext } from "@/app/Providers/FilteringCategoryProvider";
export default function Community() {
  const [category, setCategory] = useState<Category[]>([]);


   const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { payload, ok } = await GetPostAction();
      if (!ok) throw new Error("Failed to fetch posts");
      return payload;
    },
  });  
  async function handleGetCategory() {
    const { payload, ok } = await GetCategoryAction();
    if (ok) {
      setCategory(payload);
    }
    if (!ok)
    {toast.error("No Category",{position:"top-center",duration:2000})}
  }

  useEffect(() => {
    handleGetCategory();
    
  }, []);

 const context = useContext(CommunityContext);
  if (!context) throw new Error("Not Exit");
  const{selectedCategory,search}=context

const filteredPosts = posts?.filter((post) => {
  const selected = selectedCategory ? post.category == selectedCategory : true;
    const searched = search  ? post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase())
    : true;
  return  selected && searched ;
});
   if (postsLoading) return <PostLoading />;
  return (
    <div>
      {/* number of posts */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{posts?.length} Posts</p>
      </div>
      {/* community post  */}
      {filteredPosts?.map((post) => (
        <CommunityCard key={post.id} post={post} categories={category}  />
      ))}
    </div>
  );
}
