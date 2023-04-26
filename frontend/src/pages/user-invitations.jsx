import { Typography, IconButton, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faArrowLeft, faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import moment from "moment";
import RSVP from "../components/event-details/rsvp";



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
    <div className="divide-y">
      <div className='py-4 mx-6'>
        <Typography variant='h4' className="text-center">Pending Invitations</Typography>
        < Invitations  events={events.filter((e) => e.response === null)}/>
      </div>
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
    <div key={index} className="py-1 cursor-pointer" onClick={() => onClickViewEvent(e.event.pk)}>
      <Card>
        <CardBody className="flex">
          {/* <CardHeader floated={false} > */}
          <div className="flex-grow">
          <Typography className="font-semibold">
            {e.event.title}
          </Typography>
              {moment(e.event.date_scheduled).format("M/D/yyyy")} at {moment(e.event.time_scheduled, "HH:mm:ss").format("hh:mm A")}
        {/* </CardHeader> */}
          <div className="py-1">
             <Typography>Hosted by {e.host}</Typography> 
          </div>
          </div>
          <div className=" self-center" onClick={() => onClickViewEvent(e.event.pk)}>
            <RSVP event={e.event} orientation={"vertical"} response={e.response === null ? "null" : e.response.toString()}/>
            {/* <IconButton variant="text" className="mt-5 mr-2">
              <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
            </IconButton> */}
          </div>
        </CardBody>
      </Card>
    </div>
  )))

  return (
    <div className="flex h-20 items-center justify-center"><p className=" text-gray-500">No invitations</p></div>
  )
}
