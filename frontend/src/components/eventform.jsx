import { useState } from "react"


export default function EventForm() {
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = usState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  function handleCreateEvent(e){
    e.preventDefault()

    
  }

  return null
}