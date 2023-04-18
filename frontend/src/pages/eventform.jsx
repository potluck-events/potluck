import { Input, Typography, Button } from "@material-tailwind/react"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authcontext"

export default function EventForm() {
  const token = useContext(AuthContext)

  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
    
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
        date_scheduled: date,
        time_scheduled: time
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (<>
    <div className="mt-8 flex flex-col items-center justify-center">
      <Typography variant = 'h4' color="blue-gray">Sign up for an account</Typography>
      <form onSubmit={(e) => handleCreateEvent(e)}>
        <div className="mt-8 mb-4 w-80">
          <div className="flex flex-col gap-6">
            <div>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} label="Title" size="lg" />
              {error.email && <Typography variant='small' color="red">{error.email[0]}</Typography>}
            </div>
          <Button type="submit" className="" fullWidth>Sign-up</Button>
          </div>
        </div>
      <Typography variant = "small">Already have an account? <Link to="/login" className=" font-bold text-blue-800">Login</Link></Typography>
      </form>
    </div>
  </>)
}