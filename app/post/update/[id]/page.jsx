import React from 'react'
import CreatePost from '@/components/CreatePost'

export default async function UpdatePost ({params}) {
  const {id} = await params;
  return (
    <div>
        <CreatePost postId={id}/>
    </div>
  )
}


