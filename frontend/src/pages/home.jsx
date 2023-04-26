import React, { useContext } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    IconButton,
    Typography,
    Card,
    CardBody
    } from "@material-tailwind/react";
import { CalendarIcon, ListBulletIcon,} from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import moment from 'moment'
import { faAnglesRight, faCalendarPlus, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useLocalStorageState from "use-local-storage-state";
import UserAvatar from "../components/avatar";
import RSVP from "../components/event-details/rsvp";

export default function Home() {
    const token = useContext(AuthContext)
    const [hostingEvents, setHostingEvents] = useState()
    const [attendingEvents, setAttendingEvents] =useState()
    const [itemsEvents, setItemsEvents] = useState()
    const [pending, setPending] = useState()

    useEffect(() => {
        axios.get('https://potluck.herokuapp.com/events/hosting', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((response) => {
            setHostingEvents(response.data)
        })
        .catch(error => {
            console.error(error);
        });
        
        axios.get('https://potluck.herokuapp.com/events/attending', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
            }
        }).then((response) => {
            setAttendingEvents(response.data)
        })
        .catch(error => {
            console.error(error);
        });
        
        axios.get('https://potluck.herokuapp.com/items', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
            }
        }).then((response) => {
            console.log(response.data);
            setItemsEvents(response.data)
        })
        .catch(error => {
            console.error(error);
        });


        axios.get('https://potluck.herokuapp.com/invitations', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        }).then((response) => {
            setPending(response.data.filter((event) => event.response === null).length)
        })
        .catch(error => {
            console.error(error);
        });
    }, [])
    
    return (
    <>
    <Tabs className='mt-3 px-6' value="events" >
        <TabsHeader>
            <Tab value='events'>
                <div className="flex items-center gap-2">
                <CalendarIcon className = "w-5 h-5" /> Events
                </div>
            </Tab>
            <Tab value='items'>
                <div className="flex items-center gap-2">
                <ListBulletIcon className = "w-5 h-5" /> Shopping List
                </div>
            </Tab>
        </TabsHeader>
        <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
            <TabPanel value='events' className='py-0'>
                <InvitationsButton className='' pending={ pending} />
                <Typography variant="h2" className='py-2'>Hosting</Typography>
                {hostingEvents && <Events events={hostingEvents} />}
                <Typography variant="h2" className='py-2'>Attending</Typography>
                {attendingEvents && <Events events={attendingEvents} />}
            </TabPanel>
        </TabsBody>
        <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
            <TabPanel value='items'>
            <Typography variant="h2" className='py-2'>Shopping List</Typography>
                {itemsEvents &&  <Items events={itemsEvents}/>}
            </TabPanel>
        </TabsBody>
    </Tabs>
    <NewEventButton />
</>
    );
}

function Events({ events }) {
    const navigate = useNavigate()
    
    function onClickViewEvent(pk){
        navigate(`/events/${pk}`)
    }

    if (events.length > 0)
        return (
            <div className="divide-y divide-black">
                {events.map((event, index) => {
                    return (
                    <div className="" key={index}>
                        <div onClick={() => onClickViewEvent(event.pk)} className="flex py-1 cursor-pointer">
                            <div className="columns-1 py-1" >
                                <h2 className="font-semibold">{event.title}</h2>
                                <p>{moment(event.date_scheduled).format('MMMM Do, YYYY')} - {event.location_name}</p>
                            </div>
                            <div className="absolute right-0">
                                <IconButton variant="text" className="mt-1 mr-1">
                                    <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
                                </IconButton>
                            </div>
                        </div> 
                    </div>)
                })}
            </div>)
    else
        return (
            <Typography variant='small' className='font-semibold'>No Events</Typography>
        )
}


function Items({ events }) {
  const navigate = useNavigate()

  function onClickViewEvent(pk){
      navigate(`/events/${pk}`)
  }
  
  if (events.length) return (events.map((e, index) => (
    <div key={index} className="py-1 cursor-pointer">
      <Card>
        <CardBody className="flex relative">
          <div onClick={() => onClickViewEvent(e.event.pk)} className="flex-grow">
            <div className="flex items-center justify-between">
                <div>
                    <Typography className="font-semibold mb-1" variant="h5">
                        {e.title}
                    </Typography >
                    {moment(e.date_scheduled).format("M/D/yyyy")}
                </div>
                <div className="self-end">
                    <IconButton variant="text" className="mt-1 mr-1">
                        <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
                    </IconButton>
                          </div>
            </div>
                <Typography className="font-semibold mb-1" variant="h6">
                    I'm bringing:
                </Typography >
            <div>
                <div className="pl-0 divide-y border rounded">
                {e.items.map((item, index) => (
                        <EventItem item={item} key={index} />
                        ))}
                </div>
            </div>

          </div>
        </CardBody>
      </Card>
    </div>
  )))

  return (
    <div className="flex h-20 items-center justify-center"><p className=" text-gray-500">No invitations</p></div>
  )
}

function EventItem({ item }) {
    return (
    <div className="flex flex-auto flex-row items-center gap-3 py-1" >
        <FontAwesomeIcon className="ml-1" icon={faSquareCheck}/>
        <div>
            <p className="font-semibold">{item.title}</p>
            {item.description && <p className=" text-sm">{item.description}</p>}
        </div>
    </div>
    )
}


function NewEventButton() {
    const navigate = useNavigate()

    function onClickNewEvent(){
        navigate('/events/new')
    }

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <Button onClick={onClickNewEvent} className="w-20 rounded-full">
                <div className="flex justify-center">
                <FontAwesomeIcon icon={faCalendarPlus} className="w-10 h-14"/>
                </div> 
            </Button>
        </div>
    )
}


function InvitationsButton({pending}) {
    const navigate = useNavigate()

    function onClickHandleInvitations(){
        navigate('/invitations')
    }

    return (
        <div className="text-center">
            <Button onClick={onClickHandleInvitations} variant='outlined' className="flex m-auto pb-7 h-2 mt-3">
                Invitations ({pending} pending)
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pb-2">
                    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </Button>
        </div>
    )
    
}