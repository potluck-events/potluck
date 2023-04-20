import { Typography, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";



export default function UserInvitations() {
  const token = useContext(AuthContext)
  const [going, setGoing] = useState([])


  useEffect(() => {
    axios.get('https://potluck.herokuapp.com/invitations', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    }).then((response) => {
      setGoing(response.data)
    })
    .catch(error => {
      console.error(error);
    });
  }, [])

  console.log(going)

  return (
    <>
    <div className="text-center my-1">
      <Typography variant='h2'>Invitations</Typography>
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Pending</Typography>
      < PendingInvites />
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Accepted</Typography>
      < AcceptedInvites  going={going}/>
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Declined</Typography>
      < DeclinedInvites  going={going}/>
    </div>
    </>
  )
}

function PendingInvites() {
  const navigate = useNavigate()
  
  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }

  return (
  <>
    <div className="flex py-1">
      <div className="columns-1 py-1">
        <Typography className="font-semibold">Title</Typography>
        <p>Date - Location</p>
        <p>Number of Attendees</p>
      </div>
      <div className="absolute right-0">
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  </>
      )
}

function AcceptedInvites({ going }) {
  const navigate = useNavigate()
  const acceptedEvents = 
  going.filter((event) => event.response === true);

  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }
  
  return (
  <>
  {acceptedEvents.map((event) => (
    <div className="flex py-1" onClick={() => onClickViewEvent(event.pk)}>
      <div className="columns-1 py-1">
        <Typography className="font-semibold"></Typography>
        <p>{event.event}</p>
        <p>Host: {event.host}</p>
      </div>
      <div className="absolute right-0" onClick={() => onClickViewEvent(event.pk)}>
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  ))}
  </>
      )
}

function DeclinedInvites({ going }) {
  const navigate = useNavigate()
  const declinedEvents = 
  going.filter((event) => event.response === false);
  
  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }

  return (
  <>
  {declinedEvents.map((event) => (
    <div className="flex py-1" onClick={() => onClickViewEvent(event.pk)}>
      <div className="columns-1 py-1">
        <Typography className="font-semibold">Title</Typography>
        <p>{event.event}</p>
        <p>{event.host}</p>
      </div>
      <div className="absolute right-0" onClick={() => onClickViewEvent(event.pk)}>
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  ))}
  </>
      )
}