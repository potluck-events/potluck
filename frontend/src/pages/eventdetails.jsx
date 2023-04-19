import { faLocation, faLocationDot, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/eventdetails.css"


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
        let url = `https://www.google.com/maps/search/${response.data.street_address}+${response.data.city}+${response.data.state}+${response.data.zip}`
        setMapsURL(url)
      }
    }).catch(function (error) {
      console.error(error);
    });
  }, [])


  if (event) return (<>
    <div className="px-6">
      <EventHeader event={event} mapsURL={mapsURL} />
    </div>  
  </>)

  return <FontAwesomeIcon icon={faSpinner} spin/>
}


function EventHeader({ event, mapsURL }) {
  const [showMore, setShowMore] = useState(false)
  
  return (
    <div className="">
        <div className="pb-2">
          <Typography variant="h4">{event.title}</Typography>
          <Typography variant="lead">{moment(event.date_scheduled).format('MMMM Do, YYYY')}: {moment(event.time_scheduled, "HH:mm:ss").format('h:mm A')}</Typography>
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
      </div>
  )
}