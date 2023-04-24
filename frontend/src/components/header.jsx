import { Link, Outlet } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { 
        Avatar,
        Button, 
        Typography,
        Menu,
        MenuHandler,
        MenuList,
        MenuItem, 
      } from "@material-tailwind/react";
import { AuthContext } from '../context/authcontext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from './avatar';

export default function Header({setToken}) {
  const token = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userData, setUserData] = useState()
    
  function handleLogout() {
    const options = {
      method: 'POST',
      url: 'https://potluck.herokuapp.com/accounts/logout/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: {}
    };

    axios.request(options).then((response) => {
      setToken(null)
      setMobileMenuOpen(false)
    }).catch((error) => {
      console.error(error);
    }); 
  }

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
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex">
              <img className="h-10 w-auto mr-1.5" src="/temp-img/champagne-glasses.png" alt="" />
              <span className='mt-2 text-xl'>PotLuck</span>
            </Link>
          </div>
          {token &&
          <Menu className=''>
            <MenuHandler>
            <div className="flex">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <UserAvatar user={userData} className='w-6 h-6' />
              </button>
            </div>
            </MenuHandler>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
          </Menu>
          }
        </nav>
      </header>
      {!mobileMenuOpen && <Outlet />}
    </>
    )
}

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