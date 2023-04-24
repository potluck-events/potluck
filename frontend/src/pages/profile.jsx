import { Link } from 'react-router-dom'
import { 
    Avatar,
    Button, 
    Typography,
  } from "@material-tailwind/react";
  import { AuthContext } from '../context/authcontext';
  import axios from 'axios';
  import { useContext, useState, useEffect } from 'react';
  import {
    XMarkIcon,
  } from '@heroicons/react/24/outline'

export default function Profile() {
    const token = useContext(AuthContext)
    const [userData, setUserData] = useState()

        useEffect(() => {
            axios.get('https://potluck.herokuapp.com/users/me', {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': token
            }
            }).then((response) => {
            console.log(response.data);
            setUserData(response.data)
            })
            .catch(error => {
            console.error(error);
            });
        }, [])

    return (
<>
    <div className="bg-white flex items-center justify-between">
        <Link to="/" className="-m-1.5 p-1.5 flex">
        <img
            className="h-10 w-auto mr-1.5 "
            src="/temp-img/champagne-glasses.png"
            alt=""
        />
        <span className='mt-2 text-xl'>PotLuck</span>
        </Link>
        <button
        type="button"
        className="-m-2.5 rounded-md p-2.5 text-gray-700"
        onClick={() => setMobileMenuOpen(false)}
        >
        <span className="sr-only">Close menu</span>
        <XMarkIcon className="h-8 w-8" aria-hidden="true" />
        </button>
    </div>
    <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
        <div className="columns-1 flex my-8 justify-center">
            <Avatar className="h-80 aspect-square rounded-full w-auto mt-4" src="/temp-img/winnie.png" t="avatar" size="md" variant="circular"  />
        </div >
            <UserName userData={ userData} />
            <div>
            <Typography variant='paragraph' className="text-center" color="gray">
                Email: 
            </Typography>
                <EmailAddress userData={ userData} />
            </div>
            <div>
            <Typography variant='paragraph' className="text-center pt-6" color="gray">
                Location: 
            </Typography>
                <UserLocation userData={ userData} />
            </div>
        </div>
    </div>
</>
)}


function UserName({userData}) {
    return (
    <div className="py-6 text-center" color="black">
    <Typography variant='h2'>{userData.first_name} {userData.last_name}</Typography>
    </div>
    )
}


function EmailAddress({userData}) {
    return (
    <div className="text-center" color="black">
    <Typography variant='paragraph' className='font-semibold'>{userData.email}</Typography>
    </div>
    )
}

function UserLocation({userData}) {
    return (
    <div className="text-center mb-5" color="black">
    <Typography variant='paragraph' className='font-semibold'>{userData.city} </Typography>
    </div>
    )
}