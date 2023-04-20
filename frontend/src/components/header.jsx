import { Link, Outlet } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Avatar, Button, Typography,  } from "@material-tailwind/react";
import { AuthContext } from '../context/authcontext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

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
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FontAwesomeIcon icon={faUser} className='w-6 h-6' />
              </button>
            </div>
          }
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>  
            </button>      
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden " open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10 "  />
          <Dialog.Panel className="bg-white fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
                  <div className="columns-1 flex justify-center mt-7">
                    <Button variant='filled' className='w-44' color='blue' onClick={handleLogout}>Log Out</Button>
                  </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
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