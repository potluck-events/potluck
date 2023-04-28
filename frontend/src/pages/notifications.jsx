import { 
        Card,
        CardBody,
        IconButton, 
        Typography
        } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import React, { useContext } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";


export default function Notifications(){
    const token = useContext(AuthContext)
    const [notifications, setNotifications] = useState()
    const [read, setRead] = useState(false)

    useEffect (() => {
        axios.get(`https://potluck.herokuapp.com/notifications`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((response) => {
            console.log(response.data)
            setNotifications(response.data)
        })
    }, [])
        
        function handleNotifcationClick(not){
                if (read = not.is_read)
                setRead(true)
        }

        if (notifications)
    return (
        <>
        <div className="">
            {notifications.map((not, index) => {
                return (
                <Card className="my-3 mt-3 mx-6 px-6" key={index}>
                    <CardBody className="p-2">
                            <div className="flex flex-col justify-between py-1 cursor-pointer" onClick={handleNotifcationClick}>
                                <div className="flex">
                                    <div className="py-1 justify-between flex items-center mr-2" >
                                        <Typography variant='h5' >{not.header}</Typography>
                                    </div>
                                    <div className=" self-center">
                                        {not.is_read === false && <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0a0a",}} />}
                                    </div>
                                </div>
                                <div>
                                    <Typography variant='paragraph'>{not.message}</Typography>
                                </div>
                            </div> 
                    </CardBody>
                </Card>)
            })}
        </div>
        </>
        )}