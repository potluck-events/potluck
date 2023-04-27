import axios from "axios";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authcontext";


export default function InviteCodeRedirect() {
  const {code} = useParams()
  const navigate = useNavigate()
  const token = useContext(AuthContext)
console.log(code);

  const options = {
    method: 'POST',
    url: `https://potluck.herokuapp.com/invite-code/${code}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }

  axios.request(options).then((response) => {
      navigate(`/events/${response.data.event}`)
    }
  )
}