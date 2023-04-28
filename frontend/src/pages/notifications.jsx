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
import { faCircleExclamation, faX, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from 'react-router-dom'


export default function Notifications(){
    const token = useContext(AuthContext)
    const [notifications, setNotifications] = useState()
    const [read, setRead] = useState(false)
    const { pk } = useParams()
    const navigate = useNavigate()



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
        
        function handleNotifcationClick(pk){
            const options = {
                method: 'PATCH',
                url: `https://potluck.herokuapp.com/notifications/${pk}`,
                headers: {
                'Content-Type': 'application/json',
                Authorization: token
                },
                data: {is_read: true}
            };
            axios.request(options).then(function (response) {
                console.log(response.data);
                location.reload()
            }).catch(function (error) {
                console.error(error);
            })
            navigate(`/events/${pk}`);}

            function handleDelete(pk){
                const options = {
                    method: 'DELETE',
                    url: `https://potluck.herokuapp.com/notifications/${pk}`,
                    headers: { 
                    'Authorization': token
                    }
                };
                axios.request(options).then(function (response) {
                    location.reload()
                })
            }

        if (notifications)
    return (
        <>
        <div>
            <Typography variant='h3' className=' w-screen text-center border-b-2 border-black'>
                Notifications
            </Typography>
        </div>
        <div className="">
            {notifications.map((not, index) => {
                return (
                <Card className="my-3 mt-3 mx-6 px-6" key={index}>
                    <CardBody className="p-2">
                            <div className="flex flex-col justify-between py-1 columns-1" >
                                <div className="flex">
                                    <div className="py-1 justify-between flex items-center mr-2" >
                                        <Typography variant='h5' >{not.header}</Typography>
                                    </div>
                                    <div className="self-end" onClick={() => handleNotifcationClick(not.pk)}>
                                        <IconButton variant="text" className=" mr-1">
                                            <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6 cursor-pointer"/>
                                        </IconButton>
                                    </div>
                                    <div className="text-end self-center ml-auto cursor-pointer ">
                                        <FontAwesomeIcon onClick={() => handleDelete(not.pk)} icon={faX} />
                                    </div>
                                    <div className=" self-center">
                                        {not.is_read === false && <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0a0a",}}  className=""/>}
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