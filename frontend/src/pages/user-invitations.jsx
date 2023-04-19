import { Typography, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";



export default function UserInvitations() {
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
      < AcceptedInvites />
    </div>
    <div className='my-8 px-6'>
      <Typography variant='h4'>Declined</Typography>
      < DeclinedInvites />
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

function AcceptedInvites() {
  const navigate = useNavigate()
  
  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }

  return (
  <>
    <div className="flex py-1" onClick={() => onClickViewEvent(event.pk)}>
      <div className="columns-1 py-1">
        <Typography className="font-semibold">Title</Typography>
        <p>Date - Location</p>
        <p>Number of Attendees</p>
      </div>
      <div className="absolute right-0" onClick={() => onClickViewEvent(event.pk)}>
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  </>
      )
}

function DeclinedInvites() {
  const navigate = useNavigate()
  
  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }

  return (
  <>
    <div className="flex py-1" onClick={() => onClickViewEvent(event.pk)}>
      <div className="columns-1 py-1">
        <Typography className="font-semibold">Title</Typography>
        <p>Date - Location</p>
        <p>Number of Attendees</p>
      </div>
      <div className="absolute right-0" onClick={() => onClickViewEvent(event.pk)}>
        <IconButton variant="text" className="mt-5 mr-2">
          <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  </>
      )
}