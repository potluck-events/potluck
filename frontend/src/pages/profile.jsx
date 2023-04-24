import { 
    Avatar,
    Typography,
  } from "@material-tailwind/react";
  import { AuthContext } from '../context/authcontext';
  import axios from 'axios';
  import { useContext, useState, useEffect } from 'react';
    
export default function Profile() {
    const token = useContext(AuthContext)
    const [userData, setUserData] = useState('')

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

    function UserName() {
        return (
        <div className="py-6 text-center" color="black">
        <Typography variant='h2'>{userData.first_name} {userData.last_name}</Typography>
        </div>
        )
    }


    function EmailAddress() {
        return (
        <div className="text-center" color="black">
        <Typography variant='paragraph' className='font-semibold'>{userData.email}</Typography>
        </div>
        )
    }

    function UserLocation() {
        return (
        <div className="text-center mb-5" color="black">
        <Typography variant='paragraph' className='font-semibold'>{userData.city} </Typography>
        </div>
        )
    }

    return (
<>
    <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
        <div className="columns-1 flex my-8 justify-center">
            <Avatar className="h-80 aspect-square rounded-full w-auto mt-4" src="/temp-img/winnie.png" t="avatar" size="md" variant="circular"  />
        </div >
            <UserName userData={userData} />
            <div>
            <Typography variant='paragraph' className="text-center" color="gray">
                Email: 
            </Typography>
                <EmailAddress userData={userData} />
            </div>
            <div>
            <Typography variant='paragraph' className="text-center pt-6" color="gray">
                Location: 
            </Typography>
                <UserLocation userData={userData} />
            </div>
        </div>
    </div>
</>
)}
