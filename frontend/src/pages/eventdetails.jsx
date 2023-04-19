import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function EventDetails() {
  const { pk } = useParams()
  const [eventData, setEventData] = useState()


  useEffect(() => {
  
    const options = {
      method: 'GET',
      url: 'https://potluck.herokuapp.com/events/1',
      headers: { Authorization: 'Bearer 36fc1369aa32be1e8e24ef1b22c11ac5c715a1e0' }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setEventData(response.data)
    }).catch(function (error) {
      console.error(error);
    });
  })


  return null
}