import { faTrash, faCalendar, faLocation, faLocationDot, faUser, faPenToSquare, faAngleDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, Button, Dialog, Card, Chip } from "@material-tailwind/react";
import moment from "moment";
import { useState, Fragment, useRef, useContext, useEffect } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import "../../styles/eventdetails.css"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from '@headlessui/react'
import { AuthContext } from "../../context/authcontext";
import axios from "axios";

export default function EventHeader({ event, mapsURL, calFile }) {
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
        <div className="pb-2 flex-auto self-center">
          <Typography variant="h4" className=''>{event.title}</Typography>
        </div>
        {event.user_is_host ? 
          <EditMenu pk={event.pk} handleDelete={handleDelete} calFile={calFile} /> :
          <a href={ calFile.url} download={ calFile.download} className='mb-2 hover:bg-blue-400 hover:text-white text-gray-900 group flex items-center rounded-md px-2 text-sm h-12'>
                <FontAwesomeIcon className='w-5 h-5 mr-2'icon={faCalendar} />
                  Add to Calendar
                </a> }
        </div>
          <Typography variant="h6"><FontAwesomeIcon icon={faCalendar}/>  {moment(event.date_scheduled).format('MMMM Do, YYYY')}: {moment(event.time_scheduled, "HH:mm:ss").format('h:mm A')} 
          {event.end_time && ' -'} {event.end_time && (moment(event.end_time, "HH:mm:ss").format('h:mm A'))}</Typography>
        <div className="border-b-2 pb-1">
          <div className="mb-1 text-m">
            <div className="flex items-center justify-start rounded-full">
            {event.host.thumbnail ?
              <img src={event.host.thumbnail} alt="user thumbnail" className="rounded-full h-5 w-5 object-cover -ml-1 mr-1" /> :
              <FontAwesomeIcon className="mr-1" icon={faUser} />} <Typography>Hosted by {event.host.full_name} </Typography>
            </div>
          </div> 
          <Typography className="mb-1 mr-1 text-m"><FontAwesomeIcon icon={ faLocationDot }/> {event.location_name}</Typography>
          {event.street_address && <p className="ab-1 text-m"><FontAwesomeIcon icon={faLocation} /> <a href={mapsURL} target="_blank" className="font-bold text-blue-800 hover:text-blue-500">{event.street_address} {event.city} {event.state}, {event.zipcode} </a></p>}
        </div>
        <div className="mt-2">
          <Typography><span className={event.description.length > 250 ? !showMore ? "ellipsis-after-4" : "" : ""}>{event.description}</span>{event.description.length > 250 && <span className="font-bold text-blue-800 hover:text-blue-500" onClick={() => setShowMore(!showMore)}> Show {showMore? "less" : "more"}</span>}</Typography>
        </div>
        <div onClick={handleClickAttendees} className="pt-1 mt-2 flex justify-between items-center rounded hover:bg-gray-100 cursor-pointer border-t-2">
          <div className="">
            <Typography variant='h6' className='text-left mt-1 font-bold'>Attendees</Typography>
            <div className="flex justify-around gap-2">
              <Typography>Going: { event.rsvp_yes}</Typography>
              <Typography>Can't go: { event.rsvp_no}</Typography>
              <Typography>TBD: { event.rsvp_tbd}</Typography>
            </div>
          </div>  
          <FontAwesomeIcon className="h-5 w-5" icon={faAngleRight}/>
        </div>
        <div className="">
        {event.dietary_restrictions_count && <><Typography variant='h6' className='text-left mt-1 font-bold'>Guest Dietary Restrictions</Typography>
          <div className="flex pt-1 gap-x-1 flex-wrap justify-start">
            {Object.keys(event.dietary_restrictions_count)
            .filter((key) => key !== 'null').map((key) => (
              <Chip color='blue' key={key} className="h-fit my-1"
                value={`${key}`}
              />
            ))}
          </div></>}
        </div>
      </div>
  )
}


function EditMenu({ pk, handleDelete,  calFile  }){
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate()

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

  function handleEditButton() {
      navigate(`/events/${pk}/edit`)
  }

  function handleCopy() {
      navigate(`/events/${pk}/copy`)
  }

  

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
                <a
                  href={ calFile.url}
                  download={ calFile.download}
                  className={`${
                    active ? ' bg-blue-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                <FontAwesomeIcon className='w-5 h-5 mr-2'icon={faCalendar} />
                  Add to Calendar
                </a>
              )}
            </Menu.Item>
          </div>
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
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleCopy}
                  className={`${
                    active ? ' bg-blue-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                <FontAwesomeIcon className='w-5 h-5 mr-2'icon={faCopy} />
                  Duplicate
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