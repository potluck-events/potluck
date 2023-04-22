import { Input, Typography, Button, Textarea, Select, Option} from "@material-tailwind/react"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/authcontext"
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {TimePicker} from '@mui/x-date-pickers/TimePicker'
import moment from "moment"
import axios from "axios"

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

  // useEffect(({ pk }) => {
  //   axios.get(`https://potluck.herokuapp.com/events/${pk}`), {
  //     headers: {
  //       'Content-Type': 'applications/json',
  //       Authorization: token
  //     }
  //   }
  // })

  function handleCreateEvent(e){
    e.preventDefault()

    const options = {
      method: 'POST',
      url: 'http://potluck.herokuapp.com/events',
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
        time_scheduled: dateTime.format("HH:MM")
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      navigate(`/events/${response.data.pk}`)
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (<>
    <div className="mt-8 flex flex-col items-center justify-center">
      <Typography variant = 'h4' color="blue-gray">Create a new Event</Typography>
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
              <TimePicker className="w-full" required value={dateTime} onChange={(e) => setDateTime(e)} label="Date/Time" size="lg" />
            </div>
            <div>
              <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} label="Location" size="lg" />
              {!showAddress && <Typography className="text-right font-bold text-blue-800 hover:text-blue-500 cursor-pointer" onClick={(e) => setShowAddress(true)} variant="sm" >Add address</Typography>}
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
            <Button type="submit" className="" fullWidth>Create Event</Button>
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