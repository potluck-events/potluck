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
import { faAngleDown, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from './avatar';
import { useNavigate } from "react-router-dom";

export default function Header({setToken}) {
  const token = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userData, setUserData] = useState()
  const navigate = useNavigate()

    
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
      navigate('/login')
    }).catch((error) => {
      console.error(error);
    }); 
    setToken(null)
  }

  useEffect(() => {
    axios.get('https://potluck.herokuapp.com/users/me', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    }).then((response) => {
      setUserData(response.data)
    })
    .catch(error => {
      console.error(error);
    });
  }, [token])
  
  function handleProfile() {
    navigate('/profile')
  }
  
  return (
    <>
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <img className="h-8 w-auto" src="https://potluckprofilepics.s3.us-east-2.amazonaws.com/My+project.png" alt="" />
              <span className=' text-3xl font-bold'>Bash</span>
            </Link>
          </div>
          {token &&
          <Menu className=''>
            <MenuHandler>
            <div className="flex">
              <button
                type="button"
                className="-m-2.5 gap-1 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                    <UserAvatar user={userData} className='w-6 h-6' />
                    <FontAwesomeIcon icon={faAngleDown}/>
              </button>
            </div>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={handleProfile}><FontAwesomeIcon icon={faUser} className='mr-1' /> Profile</MenuItem>
              <MenuItem onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} className='mr-1' />Logout</MenuItem>
            </MenuList>
          </Menu>
          }
        </nav>
      </header>
      {!mobileMenuOpen && <Outlet />}
    </>
    )
}