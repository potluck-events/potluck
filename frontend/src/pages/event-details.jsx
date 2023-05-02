import {
  faComment,
  faList,
  faSpinner,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Tabs,
  TabsHeader,
  Tab,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/eventdetails.css";
import CreateItemModal from "../components/event-details/create-item";
import { AuthContext } from "../context/authcontext";
import EventHeader from "../components/event-details/event-header";
import RSVP from "../components/event-details/rsvp";
import Items from "../components/event-details/items";
import {
  NewItemButton,
  ReserveItemsButton,
} from "../components/event-details/item-buttons";
import Posts from "../components/event-details/posts";
import useLocalStorageState from "use-local-storage-state";
import { createEvent } from "ics";
import moment from "moment";
import { Buffer } from "buffer";

export default function EventDetails({}) {
  const location = useLocation();
  const { pk } = useParams();
  const [event, setEvent] = useState();
  const [mapsURL, setMapsURL] = useState();
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [calFile, setCalFile] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [itemData, setItemData] = useState();
  const [itemsTabOpen, setItemsTabOpen] = useState(true);

  const token = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: {
        Authorization: token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("GET", response.data);
        setEvent(response.data);

        createICS(response.data, setCalFile);
        if (response.data.street_address) {
          let url = `https://www.google.com/maps/search/${response.data.street_address}+${response.data.city}+${response.data.state}+${response.data.zipcode}`;
          setMapsURL(url);
        }
      })
      .catch(function (error) {
        console.error(error);
        if (error.response.status === 403) {
          navigate("/page403");
        } else if (error.response.status === 404) {
          navigate("/page404");
        }
      });
  }, [refresh]);

  const hasSelected = () => {
    let some = event?.items.some((item) => {
      return item.selected === true;
    });
    return some;
  };

  if (event)
    return (
      <>
        <div className="px-6">
          <EventHeader event={event} mapsURL={mapsURL} calFile={calFile} />

          {event.user_is_guest && (
            <div className="flex justify-between items-center mt-1">
              <p className="font-bold">RSVP:</p> <RSVP event={event} />
            </div>
          )}

          <EventBody
            event={event}
            setEvent={setEvent}
            setItemData={setItemData}
            setItemModalOpen={setItemModalOpen}
            userIsHost={event.user_is_host}
            itemData={itemData}
            setRefresh={setRefresh}
            itemsTabOpen={itemsTabOpen}
            setItemsTabOpen={setItemsTabOpen}
            hasSelected={hasSelected}
          />

          <CreateItemModal
            setItemModalOpen={setItemModalOpen}
            itemModalOpen={itemModalOpen}
            setItemData={setItemData}
            itemData={itemData}
            event={event}
            setEvent={setEvent}
            setRefresh={setRefresh}
          />
        </div>
      </>
    );

  return (
    <div className="h-52 flex items-center justify-center">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
}

function EventBody({
  event,
  setEvent,
  itemsTabOpen,
  setItemsTabOpen,
  setItemData,
  setItemModalOpen,
  userIsHost,
  itemData,
  setRefresh,
  hasSelected,
}) {
  return (
    <>
      <Tabs className="mt-3 mb-5" value={itemsTabOpen.toString()}>
        <TabsHeader>
          <Tab value="true" onClick={() => setItemsTabOpen(true)}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faList} className="w-5 h-5" /> Up-For-Grabs
            </div>
          </Tab>
          <Tab value="false" onClick={() => setItemsTabOpen(false)}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faComment} className="w-5 h-5" /> Posts
            </div>
          </Tab>
        </TabsHeader>
        <Items
          items={event.items}
          itemData={itemData}
          setEvent={setEvent}
          setItemData={setItemData}
          setItemModalOpen={setItemModalOpen}
          userIsHost={userIsHost}
          setRefresh={setRefresh}
          event={event}
        >
          {itemsTabOpen &&
            (hasSelected() ? (
              <ReserveItemsButton
                setEvent={setEvent}
                setRefresh={setRefresh}
                items={event.items.filter((item) => item.selected)}
              />
            ) : (
              <NewItemButton
                setItemModalOpen={setItemModalOpen}
                setItemData={setItemData}
              />
            ))}
        </Items>
        <Posts
          posts={event.posts}
          userIsHost={event.user_is_host}
          setRefresh={setRefresh}
        />
      </Tabs>
    </>
  );
}

function createICS(event, setCalFile) {
  let start = moment(moment(`${event.date_scheduled} ${event.time_scheduled}`))
    .format("YYYY-M-D-H-m")
    .split("-")
    .map(Number);
  let end = event.end_time
    ? moment(moment(`${event.date_scheduled} ${event.end_time}`))
        .format("YYYY-M-D-H-m")
        .split("-")
        .map(Number)
    : null;
  const options = {
    start: start,
    startOutputType: "local",
    title: event.title,
    description: event.description,
    location: event.location,
    url: `https://bash-events.netlify.app/events/${event.pk}`,
  };
  if (end) options.end = end;

  handleDownload();

  function handleDownload() {
    const filename = `${event.title}.ics`;
    const icsData = createEvent(options, (error, value) => {
      if (error) {
        console.error(error);
      }
      return value;
    });

    // Set the headers for the response
    const headers = {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
    };

    // Create a buffer from the ICS data and send it as the response
    const buffer = Buffer.from(icsData, "utf-8");
    const response = {
      headers,
      statusCode: 200,
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };

    //FIX THIS: Not opening on mobile
    const url = `data:text/calendar;charset=utf-8;base64,${response.body}`;
    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    setCalFile({ url: url, download: filename });
  }
}
