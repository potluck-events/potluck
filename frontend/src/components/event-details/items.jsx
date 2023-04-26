import { faAlignCenter, faAngleDown, faAngleUp, faPenToSquare, faTrash, faUser, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsBody, TabPanel, Typography, Button } from "@material-tailwind/react";
import { useContext, useState } from "react";
import "../../styles/eventdetails.css"
import Checkbox from '@mui/material/Checkbox';
import { AuthContext } from "../../context/authcontext";
import axios from "axios";
import UserAvatar from "../avatar";
import { Tooltip } from "@mui/material";

export default function Items({ items, setEvent, setItemData, setItemModalOpen, userIsHost}) {
  
  return (
    <TabsBody animate={{initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 },}}>
      <TabPanel value='true' className="pl-0 divide-y">
        {items.length ? items.map((item, index) => (
          <Item key = {index} item={item} setEvent = {setEvent} setItemModalOpen={setItemModalOpen} setItemData={setItemData} userIsHost={userIsHost} />
        )) :
          <div className="flex items-center justify-center h-52">
            <Typography className="text-gray-500" variant="h3">No Items</Typography>
          </div>}
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
      <Checkbox className={item.owner && "invisible" } disabled={item.owner ? true : false} value={item.pk} onClick={handleSelect} />
      <div className="flex flex-auto flex-col pr-2 self-start " onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6" >{item.title}</Typography>
        <p className={`${item.description ? "" : "text-gray-500"} ${expanded ? "" : "ellipsis-after-1"}`}>{item.description || "Description"}</p>
      </div>
      <div className="flex flex-col gap-3">
        {item.owner &&
          <>
          <Tooltip title={item.owner.full_name} placement="left">
              <button className=" cursor-default">
                <UserAvatar user={item.owner}>
                  {item.user_is_owner && <FontAwesomeIcon onClick={handleReleaseOwner} icon={faXmarkCircle} className="bg-white cursor-pointer rounded-full absolute -top-1 -right-1 h-4 w-4" />}
                </UserAvatar>
              </button>
            </Tooltip>
          </>
}
        {((userIsHost || item.user_is_creator)&& expanded) &&
          <>
            <FontAwesomeIcon className=" cursor-pointer" icon={faPenToSquare} onClick={handleEditItem} />
            <FontAwesomeIcon className=" cursor-pointer" icon={faTrash} onClick={handleDeleteItem}/>
          </>}
        <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} onClick={() => setExpanded(!expanded)}/>
      </div>

    </div>
  )
}
