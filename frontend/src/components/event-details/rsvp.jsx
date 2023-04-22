import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import "../../styles/eventdetails.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";


export default function RSVP({ event }) {
  const response = event.user_response === null ? "null" : event.user_response.toString()
  const [rsvp, setRsvp] = useState(response)
  const handleRSVP = (event, newRsvp) => {
    if (newRsvp !== null) {
      setRsvp(newRsvp)
    }

  }

  if (event) return (
    <div className="mt-2 flex justify-between items-center">
      <p className="font-bold">RSVP:</p>
      <ToggleButtonGroup value={rsvp} exclusive size="small" color="primary" onChange={handleRSVP}>
        <ToggleButton value="true"><FontAwesomeIcon icon ={faCheck} className="mr-1"/> Attending</ToggleButton>
        <ToggleButton value="false"><FontAwesomeIcon icon ={faXmark} className="mr-1"/> Can't Go</ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}