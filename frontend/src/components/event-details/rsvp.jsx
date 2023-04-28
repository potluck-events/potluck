import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import "../../styles/eventdetails.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authcontext";
import axios from "axios"

export default function RSVP({ event, response, orientation }) {
  if (!response) {
    response = event.user_response === null ? "null" : event.user_response.toString()
  }
  const [rsvp, setRsvp] = useState(response)
  const token = useContext(AuthContext)

  const handleRSVP = (e, newRsvp) => {
    e.preventDefault()
    if (newRsvp !== null) {
      setRsvp(newRsvp)
    } else {
      newRsvp = rsvp
    }

    if (newRsvp != rsvp) {
      const options = {
        method: 'PATCH',
        url: `https://potluck.herokuapp.com/invitations/${event.invitation_pk}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        data: { response: newRsvp }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }

  if (event) return (

      <ToggleButtonGroup orientation={orientation} value={rsvp} exclusive size="small" color="primary" onChange={handleRSVP}>
        <ToggleButton value="true"><FontAwesomeIcon icon ={faCheck} className={`mr-1 ${rsvp==="true" && " text-green-700"}`}/> Attending</ToggleButton>
        <ToggleButton value="false"><FontAwesomeIcon icon ={faXmark} className={`mr-1 ${rsvp==="false" && " text-red-700"}`}/> Can't Go</ToggleButton>
      </ToggleButtonGroup>
    
  )
}