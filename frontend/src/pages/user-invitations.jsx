import { Typography, IconButton, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faArrowLeft, faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import moment from "moment";
import RSVP from "../components/event-details/rsvp";
import UserAvatar from "../components/avatar";



export default function UserInvitations() {
  const token = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const navigate = useNavigate()



  useEffect(() => {
    axios.get('https://potluck.herokuapp.com/invitations', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    }).then((response) => {
      console.log(response.data);
      setEvents(response.data)
    })
    .catch(error => {
      console.error(error);
    });
  }, [])

  function goBack() {
    navigate(-1)
  }

  return (
    <>
      <div className="mx-6 cursor-pointer rounded bg-gray-200 w-fit p-1 px-2" onClick={goBack}>
        <FontAwesomeIcon className="" icon={faArrowLeft} /> Home
      </div>
    <div className="text-center mb-3">
      <Typography variant='h2'>Invitations</Typography>
    </div>
    <div className="divide-y-2">
      {events.filter((e) => e.response === null).length !== 0 &&
        <div className='py-4 mx-6'>
          <Typography variant='h4' className="text-center">Pending Invitations</Typography>
          < Invitations events={events.filter((e) => e.response === null)} />
        </div>}
      <div className='py-4 mx-6'>
        < Invitations  events={events.filter((e) => e.response !== null)}/>
      </div>
    </div>
    </>
  )
}



function Invitations({ events }) {
  const navigate = useNavigate()

  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }
  
  if (events.length) return (events.map((e, index) => (
    <div key={index} className="py-1 cursor-pointer">
      <Card>
        <CardBody className="flex">
          <div onClick={() => onClickViewEvent(e.event.pk)} className="flex-grow">
            <Typography className="font-semibold mb-1" variant="h5">
              {e.event.title}
            </Typography >
                {moment(e.event.date_scheduled).format("M/D/yyyy")} at {moment(e.event.time_scheduled, "HH:mm:ss").format("hh:mm A")}
            <div className="flex flex-row items-center">
               <UserAvatar user={e.event.host} className=" "/><Typography className="ml-1"> Hosted by {e.host}</Typography> 
            </div>
          </div>
          <div className=" self-center">
            <RSVP event={e.event} orientation={"vertical"} response={e.response === null ? "null" : e.response.toString()}/>
          </div>
        </CardBody>
      </Card>
    </div>
  )))

  return (
    <div className="flex h-20 items-center justify-center"><p className=" text-gray-500">No invitations</p></div>
  )
}
