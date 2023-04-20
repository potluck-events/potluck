import { faAngleDown, faAngleUp, faCalendar, faComment, faList, faLocation, faLocationDot, faPenToSquare, faPlus, faSpinner, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    IconButton,
    Typography,
    Checkbox,
    Textarea
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
import CreateItemModal from "../components/create-item";


export default function EventDetails() {
  const { pk } = useParams()
  const [event, setEvent] = useState()
  const [mapsURL, setMapsURL] = useState()
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemsTabOpen, setItemsTabOpen] = useState(true) //Is the "tab" on items?

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

function Items({ items, setEvent}) {
  
  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='items' className="pl-0 divide-y">
        {items.map((item, index) => (
          <Item key = {index} item={item} setEvent = {setEvent}/>
        ))}
      </TabPanel>
    </TabsBody>
  )
}

function Item({item, setEvent, setSelected}) {
  const [expanded, setExpanded] = useState(false)

  const handleSelect = () => {
    // setSelected(prevSelected => {
    //   const selectedIndex = prevSelected.findIndex(prevItem => prevItem.pk === item.pk)
    //   if (selectedIndex !== -1) {
    //     // If the item is already selected, remove it from the selected array
    //     const updatedSelected = prevSelected.filter(prevItem => prevItem.pk !== item.pk)
    //     return updatedSelected
    //   } else {
    //     // If the item is not selected, add it to the selected array
    //     const updatedSelected = [...prevSelected, item]
    //     return updatedSelected
    //   }
    // })

setEvent(prevEvent => {
  // Find the index of the item in the items array
  const selectedIndex = prevEvent.items.findIndex(prevItem => prevItem.pk === item.pk)
  
  // If the item was found in the array
  if (selectedIndex !== -1) {
    // Get the selected property of the item
    const selected = prevEvent.items[selectedIndex].selected
    
    // Create a copy of the items array
    const updatedItems = [...prevEvent.items]
    
    // Update the selected property of the item
    updatedItems[selectedIndex] = { ...updatedItems[selectedIndex], selected: selected != null ? !selected : true }
    
    // Create a copy of the event object with the updated items array
    const updatedEvent = { ...prevEvent, items: updatedItems }
    
    // Log the updated event object
    console.log(updatedEvent);
    
    // Return the updated event object
    return updatedEvent
  }
  
  // If the item was not found in the array, return the original event object
  return prevEvent
})
}

  return (
    <div className="flex items-center py-1">
      {!item.owner && <Checkbox value={item.pk} onClick={handleSelect} />}
      <div className="flex flex-auto flex-col pr-2 self-start" onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6">{item.title}</Typography>
        <p className={expanded ? "" : "ellipsis-after-1"}>{item.description}</p>
      </div>
      <div className="flex flex-col gap-3">
        {item.owner && <FontAwesomeIcon icon={faUser} />}
        {expanded && <FontAwesomeIcon icon={faPenToSquare} />}
        {expanded && <FontAwesomeIcon icon={faTrash} />}
        <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} onClick={() => setExpanded(!expanded)}/>
      </div>

    </div>
  )
}

function NewItemButton({setItemModalOpen}) {
    return (
        <div className="absolute right-5 bottom-5 z-30">
            <Button onClick={() => setItemModalOpen(true)} className="rounded-full">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" /> New Item            
              </div>
            </Button>
        </div>
    )
}

function ReserveItemsButton({ items }) {
  function handleReserve() {

  }

  return (
    <div className="absolute right-5 bottom-5 z-30">
        <Button onClick={() => setItemModalOpen(true)} className="rounded-full">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon icon={faCheck} className="w-5 h-5 mr-2" /> Reserve Items            
          </div>
        </Button>
    </div>
  )
}



function Posts({posts}) {
  
  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='posts'>
        <CreatePostForm />
        {posts.map((post, index) => (
          <Post post = {post} key = {index} />
        ))}
      </TabPanel>
    </TabsBody>
  )
}

function CreatePostForm() {
  const [userPost, setUserPost] = useState('')

  return (
    <form className='flex flex-col' onSubmit={(p) => handleUserPost(p)}>
      <Textarea value={userPost} onChange={(p) => setUserPost(p.target.value)} label="New post" size="lg" />
      <Button type="submit" className="w-20 self-end">Post!</Button>
    </form>
  )
}

function Post({post}) {
  return (
    <>
    <div className='my-2'>
      <div>
        <p className="font-semibold">{post.author}</p>
      </div>
      <p>{post.text}</p>
    </div>
    <div className="border-black border-t-2"></div>
    </>
  )
}