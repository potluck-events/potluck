import { useEffect, useContext, useState, Fragment } from "react"
import axios from "axios"
import { AuthContext } from "../context/authcontext"
import { Typography, Button, Input } from "@material-tailwind/react";
import { Button as MButton } from '@mui/material/';
import { Link, useLocation, useNavigate } from "react-router-dom"
import Checkbox from '@mui/material/Checkbox';

export default function EditProfile(){
    const token = useContext(AuthContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPfp] = useState()
    const [city, setCity] = useState(' ')
    const [allergies, setAllergies] = useState([])
    const [allergy, setAllergy] = useState('')



    useEffect(() => {
            axios.get(`https://potluck.herokuapp.com/users/me`, {
            headers: {
                'Content-Type': 'applications/json',
                Authorization: token
            }
            }).then((response) => {
                console.log(response)
                setFirstName(response.data.first_name)
                setLastName(response.data.last_name)
                setCity(response.data.city)
            })
            axios.get(`https://potluck.herokuapp.com/dietary-restrictions`, {
                headers: {
                    'Content-Type': 'applications/json',
                    Authorization: token
                }
            }).then((response) => {
                console.log(response.data)
                setAllergy(response.data)
            })
        }, []) 

   

            function handleCheckboxChange(e) {
                const name = e.target.value;
                const checked = e.target.checked;
                if (checked) {
                    setAllergies(allergies.concat(name))
                }
                else {
                    setAllergies(allergies.filter(a => a !== name))
                }}

            function handleUpdate(e) {
                e.preventDefault()
                const form = new FormData();
                if (pfp) {
                form.append("thumbnail", pfp);
                }
                form.append("first_name", firstName);
                form.append("last_name", lastName);
                form.append("city", city);
                form.append("dietary_restrictions_names", JSON.stringify(allergies))
                const options = {
                method: 'PATCH',
                url: 'http://potluck.herokuapp.com/users/me',
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                    Authorization: token
                },
                data: form
                };
                console.log(options);
                console.log(form)
            
                axios.request(options).then(function (response) {
                console.log(response.data);
                }).catch(function (error) {
                console.error(error);
                });
//  const form = new FormData();
// form.append("dietary_restrictions_names", "[\"vegan\"]");

// const options = {
//   method: 'PATCH',
//   url: 'http://127.0.0.1:8000/users/me',
//   headers: {
//     'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
//     Authorization: 'token ffdb97c678caf49ca887990b658200fde2018938'
//   },
//   data: '[form]'
// };

// axios.request(options).then(function (response) {
//   console.log(response.data);
// }).catch(function (error) {
//   console.error(error);
// });
            }

            function handleUpload(event) {
                setPfp(event.target.files[0])
            }

            if (allergy.length > 0)
    return (
        <>
        <div className="mt-8 flex flex-col items-center justify-center">
            <Typography variant = 'h4' color="blue-gray">Edit your account</Typography>
            <form onSubmit={(e) => handleUpdate(e)}>
            <div className="mt-8 mb-4 w-80">
                <div className="flex flex-col gap-6">
                <div>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} label="First Name" size="lg" type="text" />
                </div>
                <div>
                    <Input value= {lastName} onChange={(e) => setLastName(e.target.value)} label="Last Name" size="lg" type="text" />
                </div>
                <div>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} label="City" size="lg" type="text" />
                </div>
                <div>
                </div>
                    <div className=" border-light-blue-700 border-2 p-4 mb-6">
                        <Fragment>
                            <Typography variant='h5' className=' text-center'>Allergies</Typography>
                            <div className=" columns-2">
                                {allergy.map((a) => {
                                    return (
                                <Typography className='flex justify-start items-center'><Checkbox 
                                    onChange={handleCheckboxChange} value={a.name} id="ripple-on" />{a.name}</Typography>
                                ) })
                                }
                            </div>
                        </Fragment>
                    </div>
                <label htmlFor="raised-button-file" className=" text-center">
                    <MButton variant="contained" component="span" className="">
                    {pfp ? `File name: ${pfp.name}` : "Upload Profile Picture"}
                    </MButton>
                <input
                    className="input"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={(i) => handleUpload(i)}
                />
                </label> 
                <Button type="submit" className=" center" fullWidth>Update</Button>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}