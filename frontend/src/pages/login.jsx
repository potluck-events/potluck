import { useLocation, useNavigate } from "react-router-dom"



export default function Login(setToken) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async () => {
    //axios get request to retrieve token

    //this code sends you to the page the user was redirected from visa-cis the ProtectedRoute component if it is stored in the location context
    const origin = location.state?.from?.pathname || '/'
    navigate(origin)
  }

  return null
}