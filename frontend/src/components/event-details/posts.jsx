import { TabsBody, TabPanel, Button, Textarea, Typography } from "@material-tailwind/react";
import { useState, useContext } from "react";
import "../../styles/eventdetails.css";
import { AuthContext } from '../../context/authcontext';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";



export default function Posts({posts}) {
  
  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='posts'>
        <CreatePostForm />
        {posts.length ? posts.map((post, index) => (
          <Post post = {post} key = {index} />
        )):
          <div className="flex items-center justify-center h-40">
            <Typography className="text-gray-500" variant="h3">No Posts</Typography>
          </div>}
      </TabPanel>
    </TabsBody>
  )
}

function handleUserPost(userPost){
  const { pk } = useParams()
  const token = useContext(AuthContext)

  axios.post(`https://potluck.herokuapp.com/events/${pk}/posts`,
    {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
    }},
    {
      data: { posts: userPost}
  }).then(function(response){
    console.log(response);
    console.log('click');
    navigate(`/events/${pk}`)
  })
}

function CreatePostForm(handleUserPost) {
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