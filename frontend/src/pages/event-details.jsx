import { faComment, faList, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/eventdetails.css"
import CreateItemModal from "../components/event-details/create-item";
import { AuthContext } from "../context/authcontext";
import EventHeader from "../components/event-details/event-header";
import RSVP from "../components/event-details/rsvp";
import Items from "../components/event-details/items";
import { NewItemButton, ReserveItemsButton } from "../components/event-details/item-buttons";

export default function EventDetails() {
  const { pk } = useParams()
  const [event, setEvent] = useState()
  const [mapsURL, setMapsURL] = useState()
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemsTabOpen, setItemsTabOpen] = useState(true) //Is the "tab" on items?
  const token = useContext(AuthContext)

  useEffect(() => {
  
    const options = {
      method: 'GET',
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: { 
        'Authorization': token
      }
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


  const hasSelected = () => { 
    let some = event?.items.some((item) => {
      console.log(item);
      return item.selected === true
    })
    console.log("some:", some);
    return some
  }

  if (event) return (<>
    <div className="px-6">
      <EventHeader event={event} mapsURL={mapsURL} />

      <RSVP event={event} />
      
      <EventBody event={event} setEvent = {setEvent} setItemsTabOpen={ setItemsTabOpen }/>
      <CreateItemModal setItemModalOpen={ setItemModalOpen } itemModalOpen={ itemModalOpen } />
      {itemsTabOpen && (hasSelected() ? <ReserveItemsButton items={event.items.filter((item) => item.selected)} /> : <NewItemButton setItemModalOpen={setItemModalOpen} />)}
      
    </div>  
  </>)

  return <FontAwesomeIcon icon={faSpinner} spin/>
}



function EventBody({ event, setEvent, setItemsTabOpen }) {
  return (
    <Tabs className='mt-3' value="items" >
        <TabsHeader>
            <Tab value='items' onClick={() => setItemsTabOpen(true)}>
                <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faList} className = "w-5 h-5" /> Items
                </div>
            </Tab>
            <Tab value='posts' onClick={() => setItemsTabOpen(false)}>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faComment} className = "w-5 h-5" /> Posts
              </div>
            </Tab>
        </TabsHeader>
        <Items items={event.items} setEvent = {setEvent}/>
        <Posts posts={event.posts} />
    </Tabs>
  )
}


