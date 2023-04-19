import { faCalendar, faComment, faList, faLocation, faLocationDot, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    IconButton,
    Typography
    } from "@material-tailwind/react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/eventdetails.css"
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


export default function EventDetails() {
  const { pk } = useParams()
  const [event, setEvent] = useState()
  const [mapsURL, setMapsURL] = useState()


  useEffect(() => {
  
    const options = {
      method: 'GET',
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: { Authorization: 'Bearer 36fc1369aa32be1e8e24ef1b22c11ac5c715a1e0' }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setEvent(response.data)

      if (response.data.street_address) {
        let url = `https://www.google.com/maps/search/${response.data.street_address}+${response.data.city}+${response.data.state}+${response.data.zipcode}`
        setMapsURL(url)
      }
    }).catch(function (error) {
      console.error(error);
    });
  }, [])


  if (event) return (<>
    <div className="px-6">
      <EventHeader event={event} mapsURL={mapsURL} />

      <RSVP event={event} />

      <ItemPostTabs event={event} />
    </div>  
  </>)

  return <FontAwesomeIcon icon={faSpinner} spin/>
}


function EventHeader({ event, mapsURL }) {
  const [showMore, setShowMore] = useState(false)
  const { pk } = useParams()
  const navigate = useNavigate()

  const handleClickAttendees = () => {
    navigate(`/events/${pk}/invitations`)
  }

  return (
    <div className="">
        <div className="pb-2">
          <Typography variant="h4">{event.title}</Typography>
          <Typography variant="lead"><FontAwesomeIcon icon={faCalendar}/>  {moment(event.date_scheduled).format('MMMM Do, YYYY')}: {moment(event.time_scheduled, "HH:mm:ss").format('h:mm A')}</Typography>
        </div>
        <div>
          <header className="text-lg font-bold">Event Details:</header>
          <p className="mb-1 text-m"><FontAwesomeIcon icon={ faUser }/> Hosted by {event.host}</p>
          <p className="mb-1 text-m"><FontAwesomeIcon icon={ faLocationDot }/> Location: {event.location_name}</p>
          {event.street_address && <p className="ab-1 text-m"><FontAwesomeIcon icon={faLocation} /> Address: <a href={mapsURL} target="_blank" className="font-bold text-blue-800 hover:text-blue-500">{event.street_address} {event.city} {event.state}, {event.zipcode} </a></p>}
        </div>
        <div className="mt-2">
          <p className="font-bold">Description:</p>
          <p><span className={event.description.length > 250 ? !showMore ? "ellipsis-after-4" : "" : ""}>{event.description}</span>{event.description.length > 250 && <span className="font-bold text-blue-800 hover:text-blue-500" onClick={() => setShowMore(!showMore)}> Show {showMore? "less" : "more"}</span>}</p>
        </div>
        <div onClick={handleClickAttendees} className="mt-2 flex justify-between items-center rounded hover:bg-gray-100 cursor-pointer">
          <div>
            <p className="font-bold">Attendees:</p>
            <div className="flex justify-around gap-2">
              <p>Going: { event.rsvp_yes}</p>
              <p>Can't go: { event.rsvp_no}</p>
              <p>TBD: { event.rsvp_tbd}</p>
            </div>
          </div>  
        
          <FontAwesomeIcon className="h-5 w-5" icon={faAngleRight}/>
        </div>
      </div>
  )
}

function RSVP({ event }) {
  const handleRSVP = (response) => {

  }
  
  return (
    <div className="mt-2 flex justify-between items-center">
      <p className="font-bold">RSVP:</p>
        <Tabs value="">
          <TabsHeader>
            <Tab value='yes'>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon ={faCheck} className = "" /> Attending
                </div>
            </Tab>
            <Tab value='no'>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faXmark} className = "" /> Can't Go
              </div>
            </Tab>
        </TabsHeader>
      </Tabs>
    </div>
  )
}

function ItemPostTabs({ event }) {
  return (
    <Tabs className='mt-3' value="items" >
        <TabsHeader>
            <Tab value='items'>
                <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faList} className = "w-5 h-5" /> Items
                </div>
            </Tab>
            <Tab value='posts'>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faComment} className = "w-5 h-5" /> Posts
              </div>
            </Tab>
        </TabsHeader>
        <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
          <TabPanel value='items'>
              <Typography variant="h4" className='py-2'>Items</Typography>
              
          </TabPanel>
        </TabsBody>
        <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
          <TabPanel value='posts'>
            <Typography variant="h4" className='py-2'>Posts</Typography>
          </TabPanel>
        </TabsBody>
    </Tabs>
  )
}