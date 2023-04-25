import { Dialog, Transition, } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'
import { Input, Textarea, Button, Chip, Typography } from '@material-tailwind/react'
import { useParams } from 'react-router-dom'
import { AuthContext } from "../../context/authcontext"
import axios from 'axios'
import React from "react";

function close () {
    setInviteModalOpen(false)
  }

export default function Invitation({ inviteModalOpen, setInviteModalOpen }) {
    const { pk } = useParams()
    const token = useContext(AuthContext)
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(true);
    const [invites, setInvites] = useState([]);

    async function handleSendClick(event) {
        event.preventDefault()
        for (const e of invites) {
            let options = {
                method: 'POST',
                url: `https://potluck.herokuapp.com/events/${pk}/invitations`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    email: e.email
                }
            };
                
            const r = await axios.request(options)
        }
        location.reload()
    }

    function handleAddInvite() {
        let username
        
        axios.get(`https://potluck.herokuapp.com/users/info/${email}`, {
        headers: {
            Authorization: token
        }
        }).then((request) => {
            username = request.data[0]?.full_name;
        
            let invite = {
                email: email,
            }
            if (username) {
                invite.name = username;
            }

            setInvites([...invites, invite]);
            setEmail("");
            setShow(true)
        }).catch();
    }

    return (
        <>
        <Transition appear show={inviteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setInviteModalOpen}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Dialog.Panel className="w-full max-w-md transform flex-wrap overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                >
                    <Typography className='font-semibold'>New Invitations</Typography>
                </Dialog.Title>
                <form>
                    <div className='flex flex-wrap'>
                        {invites.map((invite, idx) => (
                            <div key={idx}>
                                <Chip
                                    className='w-fit mx-1 my-1'
                                    variant="gradient"
                                    show={show}
                                    dismissible={{
                                    onClose: () => setInvites(invites.filter((m) => m !== invite )),
                                    }}
                                    value={invite?.name ? `${invite.name} (${invite.email})` : invite.email}
                                /> 
                        </div>
                        ))}
                    </div>
                        <div className="relative flex w-full max-w-[24rem] my-3">
                            <Input
                                type="email"
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pr-20"
                                containerProps={{
                                className: "min-w-0",
                                }}
                            />
                            <Button
                                size="sm"
                                color={email ? "blue" : "blue-gray"}
                                disabled={!email}
                                className="!absolute right-1 top-1 rounded"
                                onClick={handleAddInvite}>
                                Add
                            </Button>
                            </div>
                            <div className='flex justify-end mr-3'>
                            <Button type="submit" onClick={(e) => handleSendClick(e)} className=" w-18" >Invite</Button>
                            </div>
                </form>
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
    </Transition>
    </>
    )  
}