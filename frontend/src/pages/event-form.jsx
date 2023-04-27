import { Input, Typography, Button, Textarea, Select, Option, Switch} from "@material-tailwind/react"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/authcontext"
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {TimePicker} from '@mui/x-date-pickers/TimePicker'
import moment from "moment"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBackwardStep, faX, faXmark, faAt } from "@fortawesome/free-solid-svg-icons"

export default function EventForm() {
  const token = useContext(AuthContext)
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [dateTime, setDateTime] = useState(moment().add(7, 'd'))
  const [error, setError] = useState('')
  const [showAddress, setShowAddress] = useState(false)
  const { pk } = useParams()
  const location = useLocation()
  const [endTime, setEndTime] = useState(moment().add(7, 'd'))
  const [venmoHandle, setVenmoHandle] = useState('')
  const [isOn, setIsOn] = useState(false)
  
  console.log(location);
  useEffect(() => {
    if (pk) {
    axios.get(`https://potluck.herokuapp.com/events/${pk}`, {
      headers: {
        'Content-Type': 'applications/json',
        Authorization: token
      }
    }).then((response) => {
      setTitle(response.data.title)
      setDescription(response.data.description)
      setLocationName(response.data?.location_name)
      setStreet(response.data?.street_address)
      setCity(response.data?.city)
      setState(response.data?.state)
      setZip(response.data?.zipcode)
      setDateTime(moment(`${response.data.date_scheduled} ${response.data.time_scheduled}`))

      if (response.data?.street_address || response.data?.city || response.data?.city || response.data?.state) {
        setShowAddress(true)
      }
    })
  }
  }, []) 

  function handleCreateEvent(e) {
    e.preventDefault()

    const options = {
      method: location.pathname.includes("edit") ? "PATCH" : 'POST',
      url: location.pathname.includes("edit") ? `https://potluck.herokuapp.com/events/${pk}` : 'https://potluck.herokuapp.com/events',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        title: title,
        theme: theme,
        description: description,
        location_name: locationName,
        street_address: street,
        city: city,
        state: state,
        zipcode: zip,
        date_scheduled: dateTime.format("YYYY-MM-DD"),
        time_scheduled: dateTime.format("HH:MM"),
        end_time: endTime.format("HH:MM"),
        tip_jar: venmoHandle,
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      navigate(`/events/${response.data.pk}`)
    }).catch(function (error) {
      console.error(error);
    });
  }

  function goBack() {
    navigate(-1)
  }

  function switchToggle() {
    setIsOn(!isOn)
  }

  return (<>
      <div className="mx-6 cursor-pointer rounded bg-gray-200 w-fit p-1 px-2" onClick={goBack}>
        <FontAwesomeIcon className="" icon={faArrowLeft} /> Cancel
      </div>
    <div className="mt-8 flex flex-col items-center justify-center">
      <Typography variant = 'h4' color="blue-gray">{!pk ? "Create a new event" : "Edit event"}</Typography>
      <form onSubmit={(e) => handleCreateEvent(e)}>
        <div className="mt-8 mb-4 w-80">
          <div className="flex flex-col gap-5">
            <div>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} label="Title" size="lg" />
            </div>
            <div>
              <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} label="Description" size="lg" />
            </div>
            <div>
              <DatePicker className="w-full" required value={dateTime} onChange={(e) => setDateTime(e)} label="Date/Time" size="lg" />
            </div>
            <div>
              <TimePicker className="w-full" required value={dateTime} onChange={(e) => setDateTime(e)} label="Start Time" size="lg" />
            </div>
            <div>
              <TimePicker className="w-full" value={endTime} onChange={(e) => setEndTime(e)} label="End Time" size="lg" />
            </div>
              <Switch id="ripple-on" label="Tip Jar?" checked={isOn} onChange={switchToggle} ripple={true} />
              {isOn === true &&
            <div className='flex'>
              <span className=" self-center mr-1"><FontAwesomeIcon icon={faAt} size="xl" /> </span><Input value={venmoHandle} onChange={(e) => setVenmoHandle(e.target.value)} label="Venmo Handle" size="lg" />
            </div>}
            <div>
              <Input required value={locationName} onChange={(e) => setLocationName(e.target.value)} label="Location" size="lg" />
              {!showAddress && <Typography className="text-right font-bold text-blue-800 hover:text-blue-500 cursor-pointer" onClick={(e) => setShowAddress(true)} variant="small" >Add address</Typography>}
            </div>
            {showAddress && <>
            <div>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} label="Street" size="lg" />
            </div>
            <div>
              <Input value={city} onChange={(e) => setCity(e.target.value)} label="City" size="lg" />
            </div>
            <div>         
                <States state={state} setState={setState}/>
            </div>
            <div>
              <Input value={zip} onChange={(e) => setZip(e.target.value)} label="Zip" size="lg" />
            </div>
            </>}
            <Button type="submit" className="" fullWidth>{!pk ? "Create" : "Save"} Event</Button>
          </div>
        </div>
      </form>
    </div>
  </>)
}


function States({state, setState}) {
  return (<>
    <Select value={state} onChange={(e) => setState(e)} label="State" size="lg" >
      <Option value="AL">AL</Option>
      <Option value="AK">AK</Option>
      <Option value="AR">AR</Option>
      <Option value="AZ">AZ</Option>
      <Option value="CA">CA</Option>
      <Option value="CO">CO</Option>
      <Option value="CT">CT</Option>
      <Option value="DC">DC</Option>
      <Option value="DE">DE</Option>
      <Option value="FL">FL</Option>
      <Option value="GA">GA</Option>
      <Option value="HI">HI</Option>
      <Option value="IA">IA</Option>
      <Option value="ID">ID</Option>
      <Option value="IL">IL</Option>
      <Option value="IN">IN</Option>
      <Option value="KS">KS</Option>
      <Option value="KY">KY</Option>
      <Option value="LA">LA</Option>
      <Option value="MA">MA</Option>
      <Option value="MD">MD</Option>
      <Option value="ME">ME</Option>
      <Option value="MI">MI</Option>
      <Option value="MN">MN</Option>
      <Option value="MO">MO</Option>
      <Option value="MS">MS</Option>
      <Option value="MT">MT</Option>
      <Option value="NC">NC</Option>
      <Option value="NE">NE</Option>
      <Option value="NH">NH</Option>
      <Option value="NJ">NJ</Option>
      <Option value="NM">NM</Option>
      <Option value="NV">NV</Option>
      <Option value="NY">NY</Option>
      <Option value="ND">ND</Option>
      <Option value="OH">OH</Option>
      <Option value="OK">OK</Option>
      <Option value="OR">OR</Option>
      <Option value="PA">PA</Option>
      <Option value="RI">RI</Option>
      <Option value="SC">SC</Option>
      <Option value="SD">SD</Option>
      <Option value="TN">TN</Option>
      <Option value="TX">TX</Option>
      <Option value="UT">UT</Option>
      <Option value="VT">VT</Option>
      <Option value="VA">VA</Option>
      <Option value="WA">WA</Option>
      <Option value="WI">WI</Option>
      <Option value="WV">WV</Option>
      <Option value="WY">WY</Option>
  </Select>
  </>)
}