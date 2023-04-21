import { faCalendar, faLocation, faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@material-tailwind/react";
import moment from "moment";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/eventdetails.css"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";



export default function EventHeader({ event, mapsURL }) {
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
          <p className="mb-1 text-m"><FontAwesomeIcon icon={ faUser }/> Hosted by {event.host.full_name}</p>
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
