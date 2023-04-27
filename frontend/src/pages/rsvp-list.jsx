import { Typography, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Invitation from "../components/event-details/event-invitation";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import UserAvatar from "../components/avatar";


export default function RSVPList() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { pk } = useParams()
  const token = useContext(AuthContext)
  const [invitations, setInvitation] = useState()
  const [event, setEvent] = useState()
  const navigate = useNavigate()


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
        navigate("/page403")
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
      setEvent(response.data)
    })
  }, [])

  if (invitations && event) return (
    <><div className="mx-6 cursor-pointer rounded bg-gray-200 w-fit p-1 px-2" onClick={() => navigate(-1)}>
        <FontAwesomeIcon className="" icon={faArrowLeft} /> Back
      </div>
      <EventTitle title={event.title} />
      <Invitations invitees={invitations.length} />
      <Invitation setInviteModalOpen={setInviteModalOpen} inviteModalOpen={inviteModalOpen} />
      {event.user_is_host && <InviteButton setInviteModalOpen={setInviteModalOpen} />}
      <Responses event={event} header={"Attending"} invitations={invitations.filter((i) => i.response === true)} />
      <Responses event={event} header={"TBD"} invitations={invitations.filter((i) => i.response === null)} />
      <Responses event={event} header={"Declined"} invitations={invitations.filter((i) => i.response === false)} />

    </>
  )
}
    


function EventTitle({title}){
  if (title) return (
    <div className="text-center my-2 mx-6" color="black">
    <Typography variant='h3'>{title}</Typography>
    </div>
  )
}

function Invitations({invitees}){
  return (
    <div className='flex justify-between mx-5 py-2 border-b-2'>

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

function Responses({ header, invitations, event }) {

  return (
    <div className='mx-5 my-4'>
      <Typography variant='h4'>{header}</Typography>
      {invitations.length !== 0 ? invitations.map((invitation, idx) => (
        <div key={ idx} className="flex items-start">
          <UserAvatar user={invitation.guest}/>
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

