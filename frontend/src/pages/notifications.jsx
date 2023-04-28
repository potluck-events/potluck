import { 
        Card,
        CardBody,
        IconButton 
        } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import React, { useContext } from "react";


export default function Notifications(){
    const token = useContext(AuthContext)
    const [notifications, setNotifications] = useState()


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

        if (notifications)
    return (
        <>
        <div className="">
            {notifications.map((not, index) => {
                return (
                <Card className="my-3 " key={index}>
                    <CardBody className="p-4">
                        <div className="" >
                            <div className="flex flex-col justify-between py-1 cursor-pointer">
                                <div className="py-1 justify-between flex items-center" >
                                    <h2 className="font-semibold">{not.header}</h2>
                                </div>
                            </div> 
                        </div>
                    </CardBody>
                </Card>)
            })}
        </div>
        </>
        )}