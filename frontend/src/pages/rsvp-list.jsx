import { Typography, Button, Chip } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLink, faShare, faShareFromSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import InvitationModal from "../components/event-details/invitation-modal";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import UserAvatar from "../components/avatar";
import { Dialog, Transition } from "@headlessui/react";


export default function RSVPList() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
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
      <InvitationModal setInviteModalOpen={setInviteModalOpen} inviteModalOpen={inviteModalOpen} />
      <LinkModal event={event} setLinkModalOpen={setLinkModalOpen} linkModalOpen={linkModalOpen} />
      {event.user_is_host && <InviteButton setInviteModalOpen={setInviteModalOpen} setLinkModalOpen={setLinkModalOpen} />}
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

function InviteButton({setInviteModalOpen, setLinkModalOpen}){
  return (
    <div className='mx-4 my-4 flex gap-2'>
      <Button onClick={() => setInviteModalOpen(true)} fullWidth>Invite Guests</Button>
      <Button onClick={() => setLinkModalOpen(true)} className="basis-1/3 p-0" variant="outlined"><FontAwesomeIcon icon={faLink} /> Link</Button>

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

function LinkModal({event, linkModalOpen, setLinkModalOpen}) {
  function handleShare() {
    
  }

  return (<>
        <Transition appear show={linkModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={ setLinkModalOpen}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Dialog.Panel className="w-full max-w-md transform flex-wrap overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                >
                    <Typography variant="h4" className='text-center'>Invitation Link</Typography>
                </Dialog.Title>
                <div className="flex items-center justify-center rounded my-3 bg-gray-200 hover:bg-gray-300 h-20">
                  <p className="text-gray-700">{`bash-events.netlify.app/${event.invite_code}`}</p>  
                </div>

                  <div className=''>
                    <Button onClick={handleShare} className=" w-full" ><FontAwesomeIcon icon={faShareFromSquare} /> Share Invite</Button>
                  </div>
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
    </Transition>
    </>)
}

