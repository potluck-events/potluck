import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import { useState } from "react";
import { Typography, Button, Input } from "@material-tailwind/react";


export default function Login({setToken}) {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    const options = {
      method: 'POST',
      url: 'http://127.0.0.1:8000/dj-rest-auth/login/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: email,
        password: password,
      }
    };

    axios.request(options).then((response) => {
      setToken('Token ' + response.data.key);

      //this code sends you to the page the user was redirected from visa-cis the ProtectedRoute component if it is stored in the location context
      const origin = location.state?.from?.pathname || '/'
      navigate(origin)
    }).catch((error) => {
      console.error(error);
      setError(error.response.data)
    }); 
  }

  return (
    <>
      <div className="mt-8 flex flex-col items-center justify-center">
        <Typography variant = 'h4' color="blue-gray">Login to your account</Typography>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="mt-8 mb-4 w-80">
            <div className="flex flex-col gap-6">
              <div>
                <Input required value={email} onChange={(e) => setEmail(e.target.value)} label="Email" size="lg" />
                {error.email && <Typography variant='small' color="red">{error.email[0]}</Typography>}
              </div>
              <div>
                <Input required value={password} onChange={(e) => setPassword(e.target.value)} label="Password" size="lg" type="password" />
                {error.non_field_errors && <Typography variant='small' color="red">Your password and/or username were incorrect. Please login again.</Typography>}
              </div>
            <Button type="submit" className="" fullWidth>Login</Button>
            </div>
          </div>
          <Typography variant = "small">Don't have an account? <Link to="/sign-up" className=" font-bold text-blue-800">Create one</Link></Typography>
        </form>
      </div>
  
    </>)
}