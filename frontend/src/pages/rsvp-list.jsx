import { Typography, IconButton, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Invitation from "../components/event-details/event-invitation";


export default function RSVPList() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  return (
  <>
    <EventTitle />
    <Invitations />
    <Invitation setInviteModalOpen={ setInviteModalOpen } inviteModalOpen={ inviteModalOpen } />
    <InviteButton setInviteModalOpen={ setInviteModalOpen }/>
    <Attending />
    <TBD />
    <Declined/>
  </>
  )
}


function EventTitle(){
  return (
    <div className="text-center my-2" color="black">
    <Typography variant='h3'>Event Title</Typography>
    </div>
  )
}

function Invitations(){
  return (
    <div className='flex justify-between mx-5'>
      <Typography variant='h4'>Invitations</Typography>
      <Typography variant='h4'># Invites</Typography>
    </div>
  )
}

function InviteButton({setInviteModalOpen}){
  return (
    <div className='mx-4 my-4'>
      <Button onClick={() => setInviteModalOpen(true)} fullWidth>Invite Guests</Button>
    </div>
  )
}

function Attending(){
  return (
    <div className='mx-5 my-5'>
      <Typography variant='h4'>Attending</Typography>
        <div className='mx-5 my-2'>
          <Typography variant='paragraph' className='font-semibold'>Full Name</Typography>
          <Typography variant='paragraph'>Email</Typography>
        </div>
    </div>
  )
}

function TBD(){
  return (
    <div className='mx-5 my-5'>
      <Typography variant='h4'>TBD</Typography>
        <div className='mx-5 my-2'>
          <Typography variant='paragraph' className='font-semibold'>Full Name</Typography>
          <Typography variant='paragraph'>Email</Typography>
        </div>
    </div>
  )
}

function Declined(){
  return (
    <div className='mx-5 my-5'>
      <Typography variant='h4'>Declined</Typography>
        <div className='mx-5 my-2'>
          <Typography variant='paragraph' className='font-semibold'>Full Name</Typography>
          <Typography variant='paragraph'>Email</Typography>
        </div>
    </div>
  )
}
