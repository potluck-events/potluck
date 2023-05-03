import {
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import React, { useContext } from "react";
import {
  faCircleExclamation,
  faX,
  faAnglesRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
export default function Notifications({ notifications, setNotifications }) {
  const token = useContext(AuthContext);
  const [event, setEvent] = useState();
  const { pk } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://potluck.herokuapp.com/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log(response.data);

        //Clear the incoming notifications of their new status so that the icon goes blank, but retain a shallow copy of which are new so that you can see them in the list
        const notifications = response.data.map((n) => {
          n.new_is_read = n.is_read;
          n.is_read = true;
          return n;
        });

        setNotifications(notifications);
        axios.get(`https://potluck.herokuapp.com/notifications/read`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      });
  }, []);

  function handleNotifcationClick(n) {
    let newNotifications = notifications.map((oldN) => {
      n.is_read = true;
      if (oldN.pk !== n.pk) {
        return oldN;
      } else return n;
    });
    setNotifications(newNotifications);
    navigate(`/events/${n.event}`);
  }

  function handleDelete(pk) {
    const options = {
      method: "DELETE",
      url: `https://potluck.herokuapp.com/notifications/${pk}`,
      headers: {
        Authorization: token,
      },
    };
    axios.request(options).then(function (response) {
      setNotifications(notifications.filter((n) => n.pk != pk));
    });
  }

  function handleClearAll() {
    const options = {
      method: "DELETE",
      url: `https://potluck.herokuapp.com/notifications`,
      headers: {
        Authorization: token,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setNotifications([]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  if (notifications)
    return (
      <>
        {notifications.length > 0 && (
          <div className="flex justify-center w-screen">
            <Typography variant="h3" className="">
              Notifications
            </Typography>
          </div>
        )}
        {notifications.length > 0 && (
          <div className="flex justify-end mr-4">
            <Button
              onClick={() => handleClearAll()}
              size="sm"
              variant="text"
              className="text-blue-900"
            >
              Clear All
            </Button>
          </div>
        )}
        <div className="">
          {notifications.map((not, index) => {
            return (
              <Card className="my-3 mt-3 mx-6 px-6" key={index}>
                <CardBody
                  className="p-2"
                  onClick={() => handleNotifcationClick(not)}
                >
                  <div className="flex flex-row justify-start py-1">
                    <div className="my-1.5 mr-1">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className={`${
                          not.new_is_read ? "invisible" : ""
                        } justify-start text-blue-900`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-start">
                        <div className="py-1 flex items-center mr-2 justify-start">
                          <Typography variant="h5">{not.header}</Typography>
                        </div>
                      </div>
                      <div>
                        <Typography variant="paragraph">
                          {not.message}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <FontAwesomeIcon
                  onClick={() => handleDelete(not.pk)}
                  icon={faXmark}
                  className="absolute right-3 top-3"
                />
              </Card>
            );
          })}
        </div>
        {notifications.length < 1 && (
          <>
            <div className="mt-2 text-center">
              <Typography variant="h3">Notifications</Typography>
            </div>
            <div className="mt-5">
              <iframe
                src="https://giphy.com/embed/5NlH8UPQC5DAQ"
                width="100%"
                height="100%"
                allowFullScreen
              ></iframe>
              <div className=" text-center mt-5 text-blue-900">
                <Typography variant="h4">No notifications</Typography>
              </div>
            </div>
            <p>
              <a href="https://giphy.com/gifs/will-smith-fresh-prince-of-bel-air-belair-5NlH8UPQC5DAQ"></a>
            </p>
          </>
        )}
      </>
    );
}
