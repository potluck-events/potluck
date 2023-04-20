import { Dialog, Transition, } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'
import { Input, Textarea, Button, Chip } from '@material-tailwind/react'
import { useParams } from 'react-router-dom'
import { AuthContext } from "../context/authcontext"
import axios from 'axios'
import React from "react";

function close () {
    setInviteModalOpen(false)
  }

export default function Invitation({inviteModalOpen, setInviteModalOpen}) {
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(true);
    const [emails, setEmails] = useState([]);

    function handleSendClick() {
        
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
                    New Invitations
                </Dialog.Title>
                <form>
                    <div className='flex flex-wrap'>
                        {emails.map((e) => (
                            <div key={e}>
                                <Chip
                                    className='w-fit mx-1 my-1'
                                    variant="gradient"
                                    show={show}
                                    dismissible={{
                                    onClose: () => setEmails(emails.filter((m) => m !== e )),
                                    }}
                                    value={e}
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
                                onClick={() => {
                                    setEmails([...emails, email]);
                                    setEmail("");
                                    setShow(true)
                                }}
                            >
                                Add
                            </Button>
                            </div>
                            <div className='flex justify-end mr-3'>
                            <Button type="submit" className="w-22" >Send</Button>
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