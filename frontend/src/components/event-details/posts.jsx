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
import "../../styles/eventdetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../avatar";
import moment from "moment";

export default function Posts({ posts, userIsHost, setRefresh }) {
  const { pk } = useParams();
  const token = useContext(AuthContext);

  function handleUserPost(userPost) {
    console.log(`user post: ${userPost}`);
    const options = {
      method: "POST",
      url: `https://potluck.herokuapp.com/events/${pk}/posts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: { text: userPost },
    };
    axios.request(options).then((response) => {
      setRefresh((r) => !r);
    });
  }

  function handleDelete(post) {
    console.log(post);
    const options = {
      method: "DELETE",
      url: `https://potluck.herokuapp.com/posts/${post.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };
    axios.request(options).then((response) => {
      setRefresh((r) => !r);
    });
  }

  return (
    <TabsBody
      animate={{ initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 } }}
    >
      <TabPanel value='false'>
        <CreatePostForm handleUserPost={handleUserPost} />
        {posts.length ? (
          posts.map((post, index) => (
            <Post
              post={post}
              userIsHost={userIsHost}
              key={index}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className='flex items-center justify-center h-40'>
            <Typography className='text-gray-500' variant='h3'>
              No Posts
            </Typography>
          </div>
        )}
      </TabPanel>
    </TabsBody>
  );
}

function CreatePostForm({ handleUserPost }) {
  const [userPost, setUserPost] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    handleUserPost(userPost);
    setUserPost("");
  }

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      <Textarea
        value={userPost}
        onChange={(p) => setUserPost(p.target.value)}
        label='New post'
        size='lg'
        color='indigo'
      />
      <Button
        disabled={!userPost}
        type='submit'
        className='w-full mb-3 self-end bg-blue-900'
      >
        Post!
      </Button>
    </form>
  );
}

function Post({ post, handleDelete, userIsHost }) {
  return (
    <>
      <Card
        variant='gradient'
        className='my-1 px-2'
        animate={{ initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 } }}
      >
        <div className='my-2'>
          <div className='flex items-center gap-1 mb-1'>
            <UserAvatar user={post.author} />
            <div className='flex flex-col'>
              <Typography variant='h6' className='my-0 py-0'>
                {post.author.full_name}
              </Typography>
              <Typography variant='small' className='-mt-1.5 py-0'>
                {moment(post.time_created).fromNow()}
              </Typography>
            </div>
          </div>
          <Typography variant='small'>{post.text}</Typography>
        </div>
        {(post.user_is_author || userIsHost) && (
          <FontAwesomeIcon
            onClick={() => handleDelete(post)}
            className=' absolute right-3 my-3 cursor-pointer'
            icon={faXmark}
          />
        )}
      </Card>
    </>
  );
}
