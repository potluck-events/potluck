import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import { useState } from "react";



export default function Login(setToken) {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(null)
  const [password1, setPassword1] = useState(null)
  const [password2, setPassword2] = useState(null)

  const handleLogin = () => {
    const options = {
      method: 'POST',
      url: 'http://127.0.0.1:8080/dj-rest-auth/registration/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: email,
        password1: password1,
        password2: password2,
        email: email,
      }
    };

    axios.request(options).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.error(error);
    }); 


    //this code sends you to the page the user was redirected from visa-cis the ProtectedRoute component if it is stored in the location context
    const origin = location.state?.from?.pathname || '/'
    navigate(origin)
  }

  return null
}