import { Typography, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Invitation from "../components/event-details/event-invitation";
import axios from "axios";
import { AuthContext } from "../context/authcontext";


export default function RSVPList() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { pk } = useParams()
  const token = useContext(AuthContext)
  const [invitations, setInvitation] = useState()
  const [eventTitle, setEventTitle] = useState()



  useEffect(() => {
    let options = {
      method: 'GET',
      url: `https://potluck.herokuapp.com/events/${pk}/invitations`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      setInvitation(response.data)
    }).catch(function (error) {
      console.error(error);
      if (error.response.status === 403) {
        navigate("/")
      }
    });

    //GET Event details to fill in title
    options = {
      method: 'GET',
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: { 
        'Authorization': token
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setEventTitle(response.data.title)
    })
  }, [])

  if (invitations) return (
    <>
      <EventTitle title={eventTitle} />
      <Invitations invitees={invitations.length !== 0} />
      <Invitation setInviteModalOpen={setInviteModalOpen} inviteModalOpen={inviteModalOpen} />
      <InviteButton setInviteModalOpen={setInviteModalOpen} />
      <Responses header={"Attending"} invitations={invitations.filter((i) => i.response === true)} />
      <Responses header={"TBD"} invitations={invitations.filter((i) => i.response === null)} />
      <Responses header={"Declined"} invitations={invitations.filter((i) => i.response === false)} />

    </>
  )
}
    


function EventTitle({title}){
  if (title) return (
    <div className="text-center my-2" color="black">
    <Typography variant='h3'>{title}</Typography>
    </div>
  )
}

function Invitations({invitees}){
  return (
    <div className='flex justify-between mx-5'>

      <Typography variant='h4'>Invitations</Typography>
      <Typography variant='h4'>{invitees} Invite{invitees !=1 && "s"}</Typography>
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

function Responses({ header, invitations }) {

  return (
    <div className='mx-5 my-5'>
      <Typography variant='h4'>{header}</Typography>
      {invitations.length !== 0 ? invitations.map((invitation, idx) => (
        <div key={ idx} className="flex items-start">
          <div className=" self-center rounded-full flex items-center justify-center bg-blue-400 w-8 h-8">
            {invitation.guest ? <p className="text-white m-1">{invitation.guest.initials}</p> :
              <FontAwesomeIcon className="text-white" icon={faUser} />}</div>
          <div className='mx-2 my-2'>
            {invitation.guest && <Typography variant='paragraph' className='font-semibold'>{invitation.guest.full_name}</Typography>}
            <Typography variant='paragraph'>Email: {invitation.email}</Typography>
          </div>
        </div>)) :
        <Typography variant='paragraph'>No guests</Typography>
        }
    </div>
  )
}

