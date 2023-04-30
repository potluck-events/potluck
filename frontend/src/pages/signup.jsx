import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Typography, Button, Input } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Checkbox, Button as MButton } from '@mui/material/';
import { AuthContext } from "../context/authcontext";


export default function SignUp({ setToken }) {
    const token = useContext(AuthContext)
  
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pfp, setPfp] = useState()
  const [signUpPage, setSignUpPage] = useState(1)
  const [city, setCity] = useState('')
  const [allergies, setAllergies] = useState([])
  const [allergyList, setAllergyList] = useState([])
  
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()


  
  useEffect(() => {
    axios.get(`https://potluck.herokuapp.com/dietary-restrictions`, {
        headers: {
            'Content-Type': 'applications/json',
            Authorization: token
        }
    }).then((response) => {
        setAllergyList(response.data)
    })
  }, []) 


  const handleSignup = (e) => {
    e.preventDefault()
    
    const options = {
      method: 'POST',
      url: 'https://potluck.herokuapp.com/accounts/registration/',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        username: email,
        password1: password1,
        password2: password2,
        email: email,
        first_name: firstName,
        last_name: lastName,
        thumbnail: pfp,
      }
    };
    
    axios.request(options).then((response) => {
      console.log(response.data);
      handleLogin()
      
    }).catch((error) => {
      console.error(error);
      setError(error.response.data);
    });
  }

  
  const handleLogin = () => {
    
    const options = {
      method: 'POST',
      url: 'https://potluck.herokuapp.com/accounts/login/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: email,
        password: password1,
      }
    };
    
    axios.request(options).then((response) => {
      setToken('Token ' + response.data.key);
      setSignUpPage(2)
    }).catch((error) => {
      console.error(error);
      setError(error.response.data)
    }); 
  }

  function handleCheckboxChange(e) {
    const name = e.target.value;
    const checked = e.target.checked;
    if (allergies.indexOf(name) >= 0) {
        setAllergies(allergies.filter(a => a !== name))
    }
    else {
        setAllergies(allergies.concat(name))
  }}

  function handleSetDetails(e) {
        e.preventDefault()

        const form = new FormData();

        if (pfp) form.append("thumbnail", pfp);
        form.append("city", city);
        form.append("dietary_restrictions_names", JSON.stringify(allergies))

        const options = {
          method: 'PATCH',
          url: 'https://potluck.herokuapp.com/users/me',
          headers: {
              'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
              Authorization: token
          },
          data: form
        };
    
        axios.request(options).then(function (response) {
          const origin = location.state?.from?.pathname || '/'
          navigate(origin)
        }).catch(function (error) {
            console.error(error);
        });
    }
  
  if(signUpPage === 1) return (<>
      <div className="mt-8 flex flex-col items-center justify-center">
        <Typography variant = 'h4' color="blue-gray">Sign up for an account</Typography>
        <form onSubmit={(e) => handleSignup(e)}>
          <div className="mt-8 mb-4 w-80">
            <div className="flex flex-col gap-6">
              <div>
                <Input required value={email} onChange={(e) => setEmail(e.target.value)} label="Email" size="lg" />
                {error.email && <Typography variant='small' color="red">{error.email[0]}</Typography>}
              </div>
              <div>
                <Input required value={password1} onChange={(e) => setPassword1(e.target.value)} label="Password" size="lg" type="password" />
                {error.non_field_errors && <Typography variant='small' color="red">{error.non_field_errors}</Typography>}
                {error.password1 && <Typography variant='small' color="red">{error.password1}</Typography>}
              
              </div>
              <div>
                <Input required value={password2} onChange={(e) => setPassword2(e.target.value)} label="Retype Password" size="lg" type="password" />
              </div>
             <div>
                <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} label="First Name" size="lg" type="text" />
              </div>
              <div>
                <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} label="Last Name" size="lg" type="text" />
              </div>
            <Button type="submit" className="" fullWidth>Sign-up</Button>
            </div>
          </div>
          <Typography variant = "small">Already have an account? <Link to="/login" state={{ from: location.state?.from }} className=" font-bold text-blue-800 hover:text-blue-500">Login</Link></Typography>
        </form>
      </div>
  </>)
  
  if (signUpPage === 2 && allergyList) return (<>
    <div className="mt-8 flex flex-col items-center justify-center">
      <Typography variant='h4' color="blue-gray">Sign-up Details</Typography>
      <form onSubmit={(e) => handleSetDetails(e)}>
        <div className="mt-8 mb-4 w-80">
          <div className="flex flex-col gap-6 items-center justify-center">
            <div>
              <Input value={city} onChange={(e) => setCity(e.target.value)} label="City" size="lg" type="text" />
            </div>
            <div>
              <label htmlFor="raised-button-file" >
                <MButton variant="contained" component="span" sx={{backgroundColor: "#2196f3", fontWeight: 700, fontSize: '.75rem', paddingY: ".75rem", borderRadius: '.5rem' }}>
                  {pfp ? `File name: ${pfp.name}` : "Upload Profile Picture"}
                </MButton>
              </label> 
              <input
                className="input"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={(event) => setPfp(event.target.files[0])}
              />
            </div>
            <div>
              <AllergyList allergyList={allergyList} allergies={allergies} handleCheckboxChange={handleCheckboxChange} />
            </div>
            <div>
              <Button type="submit" className="" fullWidth>{(city || allergies.length > 0 || pfp) ?"Save" : "Skip"}</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </>)
}


function AllergyList({allergyList, allergies, handleCheckboxChange}) {
    return( <div className=" border-light-blue-700 border-2 p-4 mb-6">
        <>
          <Typography variant='h5' className='text-center'>Dietary Restrictions</Typography>
          <div className=" columns-2  justify-center">
              {allergyList.map((a, index) => (
                  <Typography key={index} className='flex  items-center '>
                      <Checkbox className='' checked={allergies.indexOf(a.name) > -1} onChange={handleCheckboxChange} value={a.name} id="ripple-on" />
                      {a.name}
                  </Typography>
              ))}
          </div>
        </>
    </div>)
}
