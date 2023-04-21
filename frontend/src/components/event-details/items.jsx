import { faAngleDown, faAngleUp, faPenToSquare, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsBody, TabPanel, Typography } from "@material-tailwind/react";
import { useState } from "react";
import "../styles/eventdetails.css"
import Checkbox from '@mui/material/Checkbox';


export default function Items({ items, setEvent}) {
  
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

  return (
    <div className="flex items-center py-1">
      <Checkbox  disabled={item.owner} name={item.pk} value={item.pk} onClick={handleSelect} />
      <div className="flex flex-auto flex-col pr-2 self-start " onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6">{item.title}</Typography>
        <p className={`${item.description ? "" : "text-gray-500"} ${expanded ? "" : "ellipsis-after-1"}`}>{item.description || "Description"}</p>
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
