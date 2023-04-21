import { 
  TabsBody, 
  TabPanel, 
  Button, 
  Textarea, 
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { useState, useContext } from "react";
import "../../styles/eventdetails.css"
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from "../../context/authcontext"
import axios from 'axios'


export default function Posts({posts}) {
  const { pk } = useParams()
  const token = useContext(AuthContext)
  const navigate = useNavigate()
  
  function handleUserPost(userPost){
    console.log(`user post: ${userPost}`)
    const options = {
      method: 'POST',
      url: `https://potluck.herokuapp.com/events/${pk}/posts`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      data: {text: userPost}
    };
    axios.request(options).then(response => {
      navigate(`/events/${pk}`) 
    }
    )
  }

  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='posts'>
        <CreatePostForm  handleUserPost={handleUserPost}/>
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

function CreatePostForm({ handleUserPost }) {
  const [userPost, setUserPost] = useState('')

  function handleSubmit(event){
    handleUserPost(userPost);
    setUserPost('')
  }

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      <Textarea value={userPost} onChange={(p) => setUserPost(p.target.value)} label="New post" size="lg" />
      <Button type="submit" className="w-20 self-end">Post!</Button>
    </form>
  )
}

function Post({post}) {
  return (
    <>
    <Card color="blue" variant="gradient" className="my-1 px-2"
    animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <div className='my-2'>
        <div>
          <Typography variant='h6'>{post.author.full_name}</Typography>
        </div>
        <Typography variant='small'>{post.text}</Typography>
      </div>
      <Button></Button>
    </Card>
    </>
  )
}