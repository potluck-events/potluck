import { faTrash, faCalendar, faLocation, faLocationDot, faUser, faPenToSquare, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, Button, Dialog, Card } from "@material-tailwind/react";
import moment from "moment";
import { useState, Fragment, useRef, useContext } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import "../../styles/eventdetails.css"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from '@headlessui/react'
import { AuthContext } from "../../context/authcontext";
import axios from "axios";




export default function EventHeader({ event, mapsURL, handleEditButton }) {
  const [showMore, setShowMore] = useState(false)
  const { pk } = useParams()
  const navigate = useNavigate()
  const token = useContext(AuthContext)


  function handleDelete(){
    const options = {
      method: 'DELETE',
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: { 
        'Authorization': token
      }
    };

    axios.request(options).then(function (response) {
      navigate('/')
    })}
    


  const handleClickAttendees = () => {
    navigate(`/events/${pk}/invitations`)
  }

  return (
    <div className="">
      <div className="flex">
        <div className="pb-2 flex-auto">
          <Typography variant="h4">{event.title}</Typography>
          <Typography variant="lead"><FontAwesomeIcon icon={faCalendar}/>  {moment(event.date_scheduled).format('MMMM Do, YYYY')}: {moment(event.time_scheduled, "HH:mm:ss").format('h:mm A')}</Typography>
        </div>
        {event.user_is_host && 
          <EditMenu handleEditButton={handleEditButton} handleDelete={handleDelete}/> }
      </div>
        <div className="border-b-2">
          <p className="mb-1 text-m"><FontAwesomeIcon icon={ faUser }/> Hosted by {event.host.full_name}</p>
          <p className="mb-1 text-m"><FontAwesomeIcon icon={ faLocationDot }/> {event.location_name}</p>
          {event.street_address && <p className="ab-1 text-m"><FontAwesomeIcon icon={faLocation} /> <a href={mapsURL} target="_blank" className="font-bold text-blue-800 hover:text-blue-500">{event.street_address} {event.city} {event.state}, {event.zipcode} </a></p>}
        </div>
        <div className="mt-2">
          <p><span className={event.description.length > 250 ? !showMore ? "ellipsis-after-4" : "" : ""}>{event.description}</span>{event.description.length > 250 && <span className="font-bold text-blue-800 hover:text-blue-500" onClick={() => setShowMore(!showMore)}> Show {showMore? "less" : "more"}</span>}</p>
        </div>
        <div onClick={handleClickAttendees} className="mt-2 flex justify-between items-center rounded hover:bg-gray-100 cursor-pointer border-t-2">
          <div className="">
            <p className="font-bold">Attendees</p>
            <div className="flex justify-around gap-2">
              <p>Going { event.rsvp_yes}</p>
              <p>Can't go { event.rsvp_no}</p>
              <p>TBD { event.rsvp_tbd}</p>
            </div>
          </div>  
        
          <FontAwesomeIcon className="h-5 w-5" icon={faAngleRight}/>
        </div>
      </div>
  )
}


function EditMenu({ handleEditButton, handleDelete }){
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  function handleDeleteConfirmation() {
    setIsConfirmDeleteOpen(true);
  };

  function handleDeleteCancel() {
    setIsConfirmDeleteOpen(false);
  };

  function handleDeleteConfirmed() {
    handleDelete();
    setIsConfirmDeleteOpen(false);
  };

  

  return (
    <div className="text-right">
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-400">
          Options
          <FontAwesomeIcon icon={faAngleDown}
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleEditButton}
                  className={`${
                    active ? ' bg-blue-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                <FontAwesomeIcon className='w-5 h-5 mr-2'icon={faPenToSquare} />
                  Edit
                </button>
              )}
            </Menu.Item>
            </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDeleteConfirmation}
                  className={`${
                    active ? 'bg-blue-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                <FontAwesomeIcon className='w-5 h-5 mr-2'icon={faTrash} />
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
      {isConfirmDeleteOpen && (
        <div className="w-fit">
          <Dialog onClose={handleDeleteCancel} open={isConfirmDeleteOpen} className="fixed px-2 min-w-fit w-fit">
            <Card>
              <Typography className='pt-2 text-center' variant='h5'>Are you sure?</Typography>
              <div className="flex py-2 self-center space-x-4">
                <Button className="" color="blue" onClick={handleDeleteConfirmed}>
                  Yes
                </Button>
                <Button onClick={handleDeleteCancel}>
                  Cancel
                  </Button>
              </div>
            </Card>
          </Dialog>
        </div>
        )}
    </div>
)
}