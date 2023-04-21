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

  return (
    <>
    <div className="text-center my-1">
      <Typography variant='h2'>Invitations</Typography>
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Pending</Typography>
      < Invitations  events={going.filter((event) => event.response === null)}/>

    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Accepted</Typography>
      < Invitations  events={going.filter((event) => event.response === true)}/>
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Declined</Typography>
      < Invitations  events={going.filter((event) => event.response === false)}/>

    </div>
    </>
  )
}



function Invitations({ events }) {
  const navigate = useNavigate()

  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }
  
  if (events.length) return (events.map((event, index) => (
    <div key={index} className="flex py-1" onClick={() => onClickViewEvent(event.pk)}>
      <div className="columns-1 py-1">
        <Typography className="">
        {event.event}
        </Typography>
        <Typography className=''>
        Host: {event.host}
        </Typography>
      </div>
      <div className="absolute right-0" onClick={() => onClickViewEvent(event.pk)}>
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  )))

  return (
    <div className="flex h-20 items-center justify-center"><p className=" text-gray-500">No invitations</p></div>
  )
}
