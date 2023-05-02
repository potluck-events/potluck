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
        console.log(response.data);
        setNotifications(response.data);
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
            <Typography variant="h3" className=" underline">
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
                  <div className="flex flex-col justify-between py-1 columns-1">
                    <div className="flex justify-start">
                      <div className="py-1 flex items-center mr-2 justify-start">
                        <div className="absolute left-2 start-1 top-1">
                          {not.is_read === false && (
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              className=" justify-start text-blue-900"
                            />
                          )}
                        </div>
                        <Typography variant="h5">{not.header}</Typography>
                      </div>
                    </div>
                    <div>
                      <Typography variant="paragraph">{not.message}</Typography>
                    </div>
                  </div>
                </CardBody>
                <FontAwesomeIcon
                  onClick={() => handleDelete(not.pk)}
                  icon={faX}
                  className="absolute right-2 top-2"
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
            <div className=" text-center mt-5 text-blue-900">
              <Typography variant="h4">No new notifications</Typography>
            </div>
            <div>
              <iframe
                src="https://giphy.com/embed/5NlH8UPQC5DAQ"
                width="100%"
                height="100%"
                allowFullScreen
              ></iframe>
            </div>
            <p>
              <a href="https://giphy.com/gifs/will-smith-fresh-prince-of-bel-air-belair-5NlH8UPQC5DAQ"></a>
            </p>
          </>
        )}
      </>
    );
}
