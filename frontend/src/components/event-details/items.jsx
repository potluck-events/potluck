import {
  faAlignCenter,
  faAngleDown,
  faAngleLeft,
  faAngleUp,
  faEllipsis,
  faMinusCircle,
  faPenToSquare,
  faPlusCircle,
  faSquareCheck,
  faTrash,
  faUser,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  TabsBody,
  TabPanel,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import "../../styles/eventdetails.css";
import Checkbox from "@mui/material/Checkbox";
import { AuthContext } from "../../context/authcontext";
import axios from "axios";
import UserAvatar from "../avatar";
import { Tooltip } from "@mui/material";

export default function Items({
  items,
  setEvent,
  setItemData,
  setItemModalOpen,
  userIsHost,
  setRefresh,
}) {
  if (items.length)
    return (
      <TabsBody
        animate={{ initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 } }}
      >
        <TabPanel value="true">
          {items.filter((i) => !i.owner).length !== 0 && (
            <>
              {" "}
              <Typography variant="h5">Host needs</Typography>
              <div className="pl-0 divide-y">
                {items
                  .filter((i) => !i.owner)
                  .map((item, index) => (
                    <Item
                      key={index}
                      item={item}
                      setEvent={setEvent}
                      setItemModalOpen={setItemModalOpen}
                      setItemData={setItemData}
                      userIsHost={userIsHost}
                      setRefresh={setRefresh}
                    />
                  ))}
              </div>
            </>
          )}
          {items.filter((i) => i.owner).length !== 0 && (
            <>
              {" "}
              <Typography variant="h5" className="mt-3">
                Guests bringing
              </Typography>
              <div className="pl-0 divide-y">
                {items
                  .filter((i) => i.owner)
                  .map((item, index) => (
                    <Item
                      key={index}
                      item={item}
                      setEvent={setEvent}
                      setItemModalOpen={setItemModalOpen}
                      setItemData={setItemData}
                      userIsHost={userIsHost}
                      setRefresh={setRefresh}
                    />
                  ))}
              </div>
            </>
          )}
        </TabPanel>
      </TabsBody>
    );

  return (
    <TabsBody
      animate={{ initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 } }}
    >
      <TabPanel value="true" className="pl-0 divide-y">
        <div className="flex items-center justify-center h-52">
          <Typography className="text-gray-500" variant="h3">
            No Items
          </Typography>
        </div>
      </TabPanel>
    </TabsBody>
  );
}

function Item({
  setRefresh,
  item,
  setEvent,
  setItemData,
  setItemModalOpen,
  userIsHost,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const token = useContext(AuthContext);

  function handleDeleteItem(i) {
    const options = {
      method: "DELETE",
      url: `https://potluck.herokuapp.com/items/${item.pk}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    axios.request(options).then(() => {
      setRefresh((r) => !r);
    });
  }

  const handleSelect = () => {
    setEvent((prevEvent) => {
      // Find the index of the item in the items array
      const selectedIndex = prevEvent.items.findIndex(
        (prevItem) => prevItem.pk === item.pk
      );

      // If the item was found in the array
      if (selectedIndex !== -1) {
        // Get the selected property of the item
        const selected = prevEvent.items[selectedIndex].selected;
        const updatedItems = [...prevEvent.items];

        // Update the selected property of the item
        updatedItems[selectedIndex] = {
          ...updatedItems[selectedIndex],
          selected: selected != null ? !selected : true,
        };
        const updatedEvent = { ...prevEvent, items: updatedItems };

        return updatedEvent;
      }

      return prevEvent;
    });
  };
  function handleEditItem() {
    setItemData(item);
    setItemModalOpen(true);
  }

  function handleReleaseOwner() {
    const options = {
      method: "PATCH",
      url: `https://potluck.herokuapp.com/items/${item.pk}/reserved`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setRefresh((r) => !r);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div
      className={`${
        item.owner ? "pt-2" : ""
      } pb-1 flex flex-auto justify-start flex-row self-start items-start`}
    >
      {item.owner ? (
        <Tooltip title={item.owner.full_name} placement="top">
          <button className=" cursor-default mx-1.5">
            <UserAvatar user={item.owner}>
              {item.user_is_owner && (
                <FontAwesomeIcon
                  onClick={handleReleaseOwner}
                  icon={faXmarkCircle}
                  className="bg-white cursor-pointer rounded-full absolute -top-1 -left-1 h-4 w-4"
                />
              )}
            </UserAvatar>
          </button>
        </Tooltip>
      ) : (
        <Checkbox
          checked={item?.selected === true}
          value={item.pk}
          onClick={handleSelect}
        />
      )}
      <div
        style={item.owner ? { paddingTop: "3px" } : { paddingTop: "8.5px" }}
        className="flex flex-col flex-grow"
      >
        <div className="flex">
          <Typography variant="h6" className="flex-auto">
            {item.title}
          </Typography>
          <div className="flex flex-row gap-3 pt-1">
            {(userIsHost || item.user_is_creator) && (
              <>
                {showOptions && (
                  <>
                    <Tooltip title="Edit item" placement="left">
                      <FontAwesomeIcon
                        className=" cursor-pointer"
                        icon={faPenToSquare}
                        onClick={handleEditItem}
                      />
                    </Tooltip>
                    <Tooltip title="Delete item" placement="left">
                      <FontAwesomeIcon
                        className=" cursor-pointer"
                        icon={faTrash}
                        onClick={handleDeleteItem}
                      />
                    </Tooltip>
                  </>
                )}
                <FontAwesomeIcon
                  icon={faEllipsis}
                  onClick={() => setShowOptions(!showOptions)}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          {item.description && (
            <Typography variant="small">{item.description}</Typography>
          )}
          <DietaryRestrictions item={item} />
        </div>
      </div>
    </div>
  );
}

function DietaryRestrictions({ item, expanded }) {
  const [restrictionsExpanded, setRestrictionsExpanded] = useState(false);
  if (item.dietary_restrictions.length > 0)
    return (
      <>
        <div
          className="flex pt-1 gap-x-1 flex-wrap justify-start items-center"
          onClick={() => setRestrictionsExpanded(!restrictionsExpanded)}
        >
          {item.dietary_restrictions_names.map((r) => (
            <Chip
              color="amber"
              key={r}
              className="h-fit my-1 rounded-full"
              value={
                !restrictionsExpanded
                  ? `${r
                      .split(/[ -]/)
                      .map((w) => w.slice(0, 1))
                      .join("")}`
                  : `${r}`
              }
            />
          ))}
          <FontAwesomeIcon
            icon={expanded ? faMinusCircle : faPlusCircle}
            className="cursor-pointer w-5 h-5"
          />
        </div>
      </>
    );
}
