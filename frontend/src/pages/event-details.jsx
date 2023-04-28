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
import { createEvent } from 'ics'
import moment from "moment";

export default function EventDetails({itemsTabOpen, setItemsTabOpen}) {
  const location = useLocation()
  const { pk } = useParams()
  const [event, setEvent] = useState()
  const [mapsURL, setMapsURL] = useState()
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [calFile, setCalFile] = useState(false)
  const [itemData, setItemData] = useState()
  const token = useContext(AuthContext)
  const navigate = useNavigate()
  console.log(location);
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
      createICS(response.data)
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

  function createICS(event) {
    let start = moment(moment(`${event.date_scheduled} ${event.time_scheduled}`)).format('YYYY-M-D-H-m').split("-").map(Number)
    let end = event.end_time ? moment(moment(`${event.date_scheduled} ${event.end_time}`)).format('YYYY-M-D-H-m').split("-").map(Number) : null
    console.log(start);
    const options = {
      start: start,
      startOutputType:"local",
      title: event.title,
      description: event.description,
      location: event.location,
      url: `https://bash-events.netlify.app/events/${event.pk}`,
    }
    end ? options.end = end : ""

    handleDownload()

    async function handleDownload() {
      const filename = `${event.title}.ics`
      const file = await new Promise((resolve, reject) => {
        createEvent(options, (error, value) => {
          if (error) {
            reject(error)
          }
          
          resolve(new File([value], filename, { type: 'plain/text' }))
        })
      })
      
      const url = URL.createObjectURL(file) //.replace("blob:https","webcal").replace("blob:http","webcal");
      // trying to assign the file URL to a window could cause cross-site
      // issues so this is a workaround using HTML5
      setCalFile({url: url, download: filename})
    }
  }


  if (event) return (<>
    <div className="px-6">
      <EventHeader event={event} mapsURL={mapsURL} calFile={calFile} />

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
    <Tabs className='mt-3 mb-16' value={itemsTabOpen.toString()} >
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
    { event.tip_jar &&
    <div className="fixed left-5 bottom-5 z-50 border-2 border-green-700 rounded-full p-2 bg-green-100">
      <Tooltip content="Leave a tip for the host?" placement='right' className="ml-2 bg-light-blue-600">
        <button className="">
          <a href={`https://venmo.com/${event.tip_jar}`} target="_blank"><FontAwesomeIcon size='2xl' style={{color: "#3b9145"}}icon={faMoneyBill} /></a>
        </button>
      </Tooltip>
    </div>
    }
    </>
  )
}


