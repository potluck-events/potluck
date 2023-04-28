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
    CardBody,
    Radio,
    Menu,
    MenuHandler,
    MenuList,
    Chip,
    } from "@material-tailwind/react";
import { CalendarIcon, ListBulletIcon,} from "@heroicons/react/24/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import moment from 'moment'
import { faAnglesRight, faCalendarPlus, faCircleExclamation, faFilter, faHouse, faHouseChimney, faSpinner, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from '@mui/material/Checkbox';

export default function Home({setItemsTabOpen}) {
    const token = useContext(AuthContext)
    const [events, setEvents] = useState()
    const [itemsEvents, setItemsEvents] = useState()
    const [pending, setPending] = useState()
    const [isFilterFuture, setIsFilterFuture] = useState(true)


    useEffect(() => {
        axios.get(`https://potluck.herokuapp.com/events${isFilterFuture ? "" :"/history"}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((response) => {
            setEvents(response.data)
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
            console.log(response.data)
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

    }, [isFilterFuture])
    setItemsTabOpen(true)
    
    function handleRadio (state) {
        setIsFilterFuture(state);
        }

        
    if(events) return (
    <>
    {/* <div className="flex justify-center py-1">
        <img src="temp-img/logo2.png" alt="" />
    </div> */}
    <Tabs className='mt-3 px-6 mb-20' value="events" >
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
                <div className="relative flex items-center justify-center">
                    <InvitationsButton pending={ pending} />
                    <div className="absolute right-1 h-full flex items-center">
                        <Menu placement="bottom-end">
                            <MenuHandler>
                                <FontAwesomeIcon className='mt-3 cursor-pointer' icon={faFilter}/>
                            </MenuHandler>
                            <MenuList className='flex flex-col'>
                                <Radio id="Future Events" name="type" label="Future Events" value="1" onChange={() => handleRadio(true)} checked={isFilterFuture}/>
                                <Radio id="Past Events" name="type" label="Past Events" value="0" onChange={() => handleRadio(false)} checked={!isFilterFuture}/>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
                <div>
                    <Typography variant="h3" className='pt-4 -mb-4 text-center'>{isFilterFuture ? "My Events" : "Past Events"}</Typography>
                    {events && <Events events={events} />}
                </div>
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

  return (<div className="h-52 flex items-center justify-center"><FontAwesomeIcon icon={faSpinner} spin/></div>)

}

function Events({ events }) {
    const navigate = useNavigate()
    
    function onClickViewEvent(pk){
        navigate(`/events/${pk}`)
    }

    if (events.length > 0)
        return (
            <>
            <div className="">
                {events.map((event, index) => {
                    return (
                    <Card className="my-3 " key={index}>
                        <CardBody className="p-4">
                            <div className="" >
                                <div onClick={() => onClickViewEvent(event.pk)} className="flex flex-col justify-between py-1 cursor-pointer">
                                    <div className="py-1 justify-between flex items-center" >
                                        <h2 className="font-semibold">{event.title}</h2>
                                            {event.user_is_host === true && <Chip value='Hosting' className="mt-2" icon={<FontAwesomeIcon icon={faHouseChimney} className=" h-4 w-4 p-0.5"/>}/>}
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                    <p>{moment(event.date_scheduled).format('MMMM Do, YYYY')} - {event.location_name}</p>
                                        <IconButton variant="text" className="mt-1 mr-1">
                                            <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6"/>
                                        </IconButton>
                                    </div>
                                </div> 
                            </div>
                        </CardBody>
                    </Card>)
                })}
            </div>
            </>)
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
<div key={index} className="py-1">
    <Card className="">
        <CardBody className="flex relative">
        <div className="flex-grow">
            <div className="flex items-center justify-between">
                <div>
                    <Typography className="font-semibold" variant="h5">
                        {e.title}
                    </Typography >
                </div>
                <div className="self-end">
                    <IconButton variant="text" className=" mr-1">
                        <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6 cursor-pointer" onClick={() => onClickViewEvent(e.pk)}/>
                    </IconButton>
                        </div>
            </div>
            <div>
                <div className="pl-0">
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

// function handleCheckChange(){
//     setShoppingList()
// }

function EventItem({ item }) {
    const token = useContext(AuthContext)
    const [isAcquired, setIsAcquired] = useState(item.is_acquired)
    console.log(item)

    function handleChecked(){
        const options = {
            method: 'PATCH',
            url: `https://potluck.herokuapp.com/items/${item.pk}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            data: {is_acquired: !isAcquired}
            };
        axios.request(options).then(setIsAcquired(!isAcquired))
    }

    return (
    <div className="flex flex-auto flex-row items-center gap-3" >
        <div>
        <Typography className='flex justify-start items-center'>
            <Checkbox checked={isAcquired} onChange={handleChecked} value={item.title} id="ripple-on" />
                {item.title}
        </Typography>
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
        <div className="  fixed bottom-5 right-5 z-50">
            <Button onClick={onClickNewEvent} className="w-16 h-16 rounded-full p-0 shadow-lg shadow-gray-600/50">
                <div className="flex justify-center">
                <FontAwesomeIcon icon={faCalendarPlus} className="w-8 h-12"/>
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
                <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pb-2">
                    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </Button>
        </div>
    )
    
}