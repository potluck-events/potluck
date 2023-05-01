import {
  Card,
  CardBody,
  IconButton,
  Typography,
  Button,
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

export default function Notifications() {
  const token = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
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
      });
  }, []);

  function handleNotifcationClick(not) {
    const options = {
      method: "PATCH",
      url: `https://potluck.herokuapp.com/notifications/${not.pk}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: { is_read: true },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        navigate(0);
      })
      .catch(function (error) {
        console.error(error);
      });
    console.log(not);
    navigate(`/events/${not.event}`);
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
      navigate(0);
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
        <div className="flex justify-center w-screen mb-10">
          <Typography variant="h3" className=" underline">
            Notifications
          </Typography>
          <Button
            onClick={() => handleClearAll()}
            size="sm"
            variant="text"
            className="absolute end-2 mt-12"
          >
            Clear All
          </Button>
        </div>
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
                              style={{ color: "blue" }}
                              className=" justify-start"
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
      </>
    );
}
