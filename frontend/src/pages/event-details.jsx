import { faComment, faList, faSpinner, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsHeader, Tab, Button, Tooltip } from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/eventdetails.css"
import CreateItemModal from "../components/event-details/create-item";
import { AuthContext } from "../context/authcontext";
import EventHeader from "../components/event-details/event-header";
import RSVP from "../components/event-details/rsvp";
import Items from "../components/event-details/items";
import { NewItemButton, ReserveItemsButton } from "../components/event-details/item-buttons";
import Posts from "../components/event-details/posts";
import useLocalStorageState from "use-local-storage-state";

export default function EventDetails() {
  const location = useLocation()
  const { pk } = useParams()
  const [event, setEvent] = useState()
  const [mapsURL, setMapsURL] = useState()
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemData, setItemData] = useState()
  const [itemsTabOpen, setItemsTabOpen] = useLocalStorageState('tabState', { defaultValue: true }) //Is the "tab" on items?
  const token = useContext(AuthContext)
  const navigate = useNavigate()
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
      if (error.response.status === 403) {
        navigate("/page403")
      }
    });
  }, [])

  const hasSelected = () => { 
    let some = event?.items.some((item) => {
      return item.selected === true
    })
    return some
  }

  if (event) return (<>
    <div className="px-6">
      <EventHeader event={event} mapsURL={mapsURL} />

      {event.user_is_guest &&
          <div className="flex justify-between items-center">
            <p className="font-bold">RSVP:</p>  <RSVP event={event} />
          </div>}
      
      <EventBody event={event} setEvent={setEvent} setItemsTabOpen={setItemsTabOpen} itemsTabOpen={itemsTabOpen} setItemData={setItemData} setItemModalOpen={setItemModalOpen} userIsHost={event.user_is_host} />
      
      <CreateItemModal setItemModalOpen={setItemModalOpen} itemModalOpen={itemModalOpen} setItemData={setItemData} itemData={itemData}/>
      
      {itemsTabOpen && (hasSelected() ? <ReserveItemsButton items={event.items.filter((item) => item.selected)} /> : <NewItemButton setItemModalOpen={setItemModalOpen} />)}
      
    </div>  
  </>)

  return (<div className="h-52 flex items-center justify-center"><FontAwesomeIcon icon={faSpinner} spin/></div>)
}


function EventBody({ event, setEvent, itemsTabOpen, setItemsTabOpen, setItemData , setItemModalOpen, userIsHost}) {
  return (
    <>
    <Tabs className='mt-3' value={itemsTabOpen.toString()} >
        <TabsHeader>
            <Tab value='true' onClick={() => setItemsTabOpen(true)}>
                <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faList} className = "w-5 h-5" /> Up-For-Grabs
                </div>
            </Tab>
            <Tab value='false' onClick={() => setItemsTabOpen(false)}>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon ={faComment} className = "w-5 h-5" /> Posts
              </div>
            </Tab>
        </TabsHeader>
        <Items items={event.items} setEvent={setEvent} setItemData={setItemData} setItemModalOpen={setItemModalOpen} userIsHost={userIsHost} />
        <Posts posts={event.posts} userIsHost={event.user_is_host} />
    </Tabs>
    <div className="fixed left-5 bottom-5 z-30 border-2 border-green-600 rounded-full p-2">
      <Tooltip content="Leave a tip for the host?" placement='right'>
        <button className="">
          <a href={`https://venmo.com/${event.tip_jar}`} target="_blank"><FontAwesomeIcon size='2xl' style={{color: "#26c51b"}}icon={faMoneyBill} /></a>
        </button>
      </Tooltip>
    </div>
    </>
  )
}


