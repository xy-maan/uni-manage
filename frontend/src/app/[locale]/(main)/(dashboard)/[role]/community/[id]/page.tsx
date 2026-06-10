import { GetCommentAction } from '@/Actions/getAllComments.action';
import { GetCategoryAction } from '@/Actions/getCategory.action';
import { GetSinglePostAction } from '@/Actions/getSinglePost.action';
import Comments from '@/app/[locale]/_Components/CommunityComponent/Comments';
import CommunityCard from '@/app/[locale]/_Components/CommunityComponent/CommunityCard';
import React from 'react'

export default async function SinglePost({
  params,
}:{
  params: Promise< { id: string }>;
}) {
  const { id } = await params; 
   const {payload,ok} = await GetSinglePostAction(id);
   
   const res =await GetCategoryAction()
   const categories=res.payload
   const { payload: initialComments } = await GetCommentAction(Number(id));
   if (!ok || !payload) return <div>Post not found</div>;
  return (
    <div >
      <div className="container mx-auto px-4 lg:px-8 py-8">

      <div className="lg:w-3/4 md:w-1/2 w-full mx-auto">
      <CommunityCard post={payload} categories={categories}  />
       <Comments postId={payload.id}  /> 
      </div>
      </div>
    </div>
  )
}
