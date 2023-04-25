import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { AuthContext } from "../context/authcontext"
import { Typography, Button, Input } from "@material-tailwind/react";
import { Button as MButton } from '@mui/material/';
import { Link, useLocation, useNavigate } from "react-router-dom"


export default function EditProfile(){
    const token = useContext(AuthContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPfp] = useState()


    useEffect(() => {
            axios.get(`https://potluck.herokuapp.com/users/me`, {
            headers: {
                'Content-Type': 'applications/json',
                Authorization: token
            }
            }).then((response) => {
                console.log(response)
            })
        }, []) 

            const handleUpdate = () => {

                const form = new FormData();
                form.append("thumbnail", pfp);
                form.append("first_name", firstName);
                form.append("last_name", lastName);
                const options = {
                method: 'PATCH',
                url: 'https://potluck.herokuapp.com/users/me',
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                    Authorization: token
                },
                data: form
                };
                console.log(options);
            
                axios.request(options).then(function (response) {
                console.log(response.data);
                }).catch(function (error) {
                console.error(error);
                });
            }

    return (
        <>
        <div className="mt-8 flex flex-col items-center justify-center">
            <Typography variant = 'h4' color="blue-gray">Edit your account</Typography>
            <form onSubmit={(e) => handleSignup(e)}>
            <div className="mt-8 mb-4 w-80">
                <div className="flex flex-col gap-6">
                <div>
                    <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} label="First Name" size="lg" type="text" />
                </div>
                <div>
                    <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} label="Last Name" size="lg" type="text" />
                </div>
                <div>
                </div>
                <label htmlFor="raised-button-file">
                    <MButton variant="contained" component="span" className="">
                    Upload
                    </MButton>
                </label> 
                <input
                    className="input"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={(i) => handleUpload(i)}
                />
                <Button type="submit" className="" fullWidth>Update</Button>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}