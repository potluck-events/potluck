import { TabsBody, TabPanel, Button, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import "../styles/eventdetails.css"


export default function Posts({posts}) {
  
  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='posts'>
        <CreatePostForm />
        {posts.map((post, index) => (
          <Post post = {post} key = {index} />
        ))}
      </TabPanel>
    </TabsBody>
  )
}

function CreatePostForm() {
  const [userPost, setUserPost] = useState('')

  return (
    <form className='flex flex-col' onSubmit={(p) => handleUserPost(p)}>
      <Textarea value={userPost} onChange={(p) => setUserPost(p.target.value)} label="New post" size="lg" />
      <Button type="submit" className="w-20 self-end">Post!</Button>
    </form>
  )
}

function Post({post}) {
  return (
    <>
    <div className='my-2'>
      <div>
        <p className="font-semibold">{post.author}</p>
      </div>
      <p>{post.text}</p>
    </div>
    <div className="border-black border-t-2"></div>
    </>
  )
}