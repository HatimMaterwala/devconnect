import React from 'react'
import CreatePost from '@/components/CreatePost'

export default async function UpdatePost ({params}) {
  const {postId} = await params;
  return (
    <div>
      // Back to work baby
        <CreatePost pId={postId}/>
    </div>
  )
}


