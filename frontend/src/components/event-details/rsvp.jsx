import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import "../styles/eventdetails.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function RSVP({ event }) {
  const handleRSVP = (attending) => {

  }
  
  return (
    <div className="mt-2 flex justify-between items-center">
      <p className="font-bold">RSVP:</p>
        <Tabs value="">
          <TabsHeader>
            <Tab value='yes' onClick={() => handleRSVP(true)}>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon ={faCheck} className = "" /> Attending
                </div>
            </Tab>
            <Tab value='no' onClick={() => handleRSVP(false)}>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faXmark} className = "" /> Can't Go
              </div>
            </Tab>
        </TabsHeader>
      </Tabs>
    </div>
  )
}