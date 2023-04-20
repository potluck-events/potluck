import { Dialog, Transition, } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'
import { Input, Textarea, Button } from '@material-tailwind/react'
import { useParams } from 'react-router-dom'
import { AuthContext } from "../context/authcontext"
import axios from 'axios'



export default function CreateItemModal({itemModalOpen, setItemModalOpen}) {
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const { pk } = useParams()
const token = useContext(AuthContext)

  function close () {
    setItemModalOpen(false)
  }

  function handleCreateItem(i){
    i.preventDefault()
    axios.post(`https://potluck.herokuapp.com/events/${pk}/items/`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token
      },
      data: {
        title: title,
        description: description
      }
    });
  }

  return (
    <>
      <Transition appear show={itemModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setItemModalOpen}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Item
                  </Dialog.Title>
                  <form onSubmit={(i) => handleCreateItem(i)}>
                    <div className="mt-3">
                      <Input value={title} onChange={(t) => setTitle(t.target.value)} label="Item" size="lg" />
                    </div>
                    <div className='my-2'>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} label="Description" size="lg" />
                    </div>
                    <div className="flex justify-center">
                      <Button type="submit" onClick={close} className="w-32" >Add</Button>
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