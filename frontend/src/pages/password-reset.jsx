import { useState } from "react";
import { Typography, Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom"


export default function PasswordReset() {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const [error, setError] = useState("")


    const handleReset = (e) => {
        e.preventDefault()

        const options = {
            method: 'POST',
            url: 'https://potluck.herokuapp.com/accounts/password/reset/',
            headers: {
            'Content-Type': 'application/json'
            },
            data: {
            email: email,
            },
        };
        axios.request(options)
        .then((response) => {
            console.log(response.data)
            navigate('/')
        })
        .catch((error) => {
            console.error(error);
            setError(error.response.data);})
    }
    
    return (
    <>
    <div className="text-center py-5">
        <Typography variant='h4'>Password Reset</Typography>
    </div>
    <div className="text-center">
        <Typography variant='paragraph'>
        Enter the email associated with your account 
        to change your password.
        </Typography>
    </div>
    <div className="flex justify-center">
        <form onSubmit={handleReset}>
            <div className="flex col-1 mt-8 mb-4 w-80 ">
                <Input required value={email} onChange={(e) => setEmail(e.target.value)} label="Email" size="lg" />
            </div>
            <Button type="submit" className="" fullWidth>Reset</Button>
        </form>
    </div>
    </>
    )
}