import { faAlignCenter, faAngleDown, faAngleLeft, faAngleUp, faMinusCircle, faPenToSquare, faPlusCircle, faSquareCheck, faTrash, faUser, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsBody, TabPanel, Typography, Button, Chip } from "@material-tailwind/react";
import { useContext, useState } from "react";
import "../../styles/eventdetails.css"
import Checkbox from '@mui/material/Checkbox';
import { AuthContext } from "../../context/authcontext";
import axios from "axios";
import UserAvatar from "../avatar";
import { Tooltip } from "@mui/material";

export default function Items({ items, setEvent, setItemData, setItemModalOpen, userIsHost}) {
  
  if (items.length) return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='true' >
        {items.filter((i) => !i.owner).length !== 0 &&<> <Typography variant="h5" >Host needs</Typography>
        <div className="pl-0 divide-y">{items.filter((i) => !i.owner).map((item, index) => (
            <Item key={index} item={item} setEvent={setEvent} setItemModalOpen={setItemModalOpen} setItemData={setItemData} userIsHost={userIsHost} />))}
        </div></>}
        {items.filter((i) => i.owner).length !== 0 && <> <Typography variant="h5" className="mt-3">Guests bringing</Typography>
          <div className="pl-0 divide-y">{items.filter((i) => i.owner).map((item, index) => (
            <Item key={index} item={item} setEvent={setEvent} setItemModalOpen={setItemModalOpen} setItemData={setItemData} userIsHost={userIsHost} />))}
          </div></>}
      </TabPanel>
    </TabsBody>
  )

  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='true' className="pl-0 divide-y">
          <div className="flex items-center justify-center h-52">
            <Typography className="text-gray-500" variant="h3">No Items</Typography>
          </div>
      </TabPanel>
    </TabsBody>
  )
}

function Item({item, setEvent, setItemData, setItemModalOpen, userIsHost}) {
  const [expanded, setExpanded] = useState(false)
  const token = useContext(AuthContext)

  function handleDeleteItem(i) {
    const options = {
      method: 'DELETE',
      url: `https://potluck.herokuapp.com/items/${item.pk}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    };

    axios.request(options).then(() => {
      location.reload()
    })
  }


  const handleSelect = () => {
    setEvent(prevEvent => {
      // Find the index of the item in the items array
      const selectedIndex = prevEvent.items.findIndex(prevItem => prevItem.pk === item.pk)
      
      // If the item was found in the array
      if (selectedIndex !== -1) {
        // Get the selected property of the item
        const selected = prevEvent.items[selectedIndex].selected
        const updatedItems = [...prevEvent.items]
        
        // Update the selected property of the item
        updatedItems[selectedIndex] = { ...updatedItems[selectedIndex], selected: selected != null ? !selected : true }
        const updatedEvent = { ...prevEvent, items: updatedItems }

        return updatedEvent
      }

      return prevEvent
    })

  }
  function handleEditItem() {
    setItemData(item)
    setItemModalOpen(true)
  }

  function handleReleaseOwner() {
    const options = {
        method: 'PATCH',
        url: `https://potluck.herokuapp.com/items/${item.pk}/reserved`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
        location.reload()
      }).catch(function (error) {
        console.error(error);
      });

    
  }

  return (
    <div className="flex items-center py-1">
      {item.owner ?
        <Tooltip title={item.owner.full_name} placement="top">
          <button className=" cursor-default mx-1.5">
            <UserAvatar user={item.owner}>
              {item.user_is_owner && <FontAwesomeIcon onClick={handleReleaseOwner} icon={faXmarkCircle} className="bg-white cursor-pointer rounded-full absolute -top-1 -left-1 h-4 w-4" />}
            </UserAvatar>
          </button>
        </Tooltip>:
        <Checkbox className={item.owner && "invisible"} disabled={item.owner ? true : false} value={item.pk} onClick={handleSelect} />}
      <div onClick={() => setExpanded(!expanded)} className="flex-grow">
        <div className="flex-grow">
          <div className="flex flex-auto justify-between flex-row pr-2 self-start " onClick={() => setExpanded(!expanded)}>
          <Typography variant="h6" >{item.title}</Typography>
            <div className="flex flex-row gap-3 self-start pt-1">
              {((userIsHost || item.user_is_creator)&& expanded) &&
              <>
              <Tooltip title="Edit item" placement="left">
                <FontAwesomeIcon className=" cursor-pointer" icon={faPenToSquare} onClick={handleEditItem} />
              </Tooltip>
              <Tooltip title="Delete item" placement="left">
                <FontAwesomeIcon className=" cursor-pointer" icon={faTrash} onClick={handleDeleteItem} />
              </Tooltip>
              </>}
            <FontAwesomeIcon icon={expanded ? faAngleLeft : faAngleDown} onClick={() => setExpanded(!expanded)}/>
          </div>
        </div>
        <p className={`${item.description ? "" : "text-gray-500"} ${expanded ? "" : "ellipsis-after-1"}`} >{item.description}</p>
        <DietaryRestrictions item={item} expanded={expanded} />
      
        </div>
      </div>
    </div>
  )
}


function DietaryRestrictions({ item, expanded }) {
  if (item.dietary_restrictions.length > 0) return (
    <>
      <div className="flex pt-1 gap-x-1 flex-wrap justify-start items-center" onClick={() => setRestrictionsExpanded(!restrictionsExpanded)}>
        {item.dietary_restrictions_names.map((r) => (
          <Chip color='amber' key={r} className="h-fit my-1 rounded-full"
            value={!expanded ? `${r.split(/[ -]/).map((w) => w.slice(0, 1)).join("")}` : `${r}`}
          />
        ))}
        <FontAwesomeIcon icon={expanded ? faMinusCircle : faPlusCircle} className="cursor-pointer w-5 h-5"  />
      </div></>
  )
}
