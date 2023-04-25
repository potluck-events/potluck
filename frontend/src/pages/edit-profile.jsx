import { useEffect, useContext, useState, Fragment } from "react"
import axios from "axios"
import { AuthContext } from "../context/authcontext"
import { Typography, Button, Input, Checkbox } from "@material-tailwind/react";
import { Button as MButton } from '@mui/material/';
import { Link, useLocation, useNavigate } from "react-router-dom"


export default function EditProfile(){
    const token = useContext(AuthContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPfp] = useState()
    const [city, setCity] = useState('')
    const [allergies, setAllergies] = useState([])


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

            console.log(allergies.toString())

            function handleUpdate(e) {
                e.preventDefault()
                // const form = new FormData();
                // form.append("thumbnail", pfp);
                // form.append("first_name", firstName);
                // form.append("last_name", lastName);
                // form.append("city", city);
                // form.append("dietary_restrictions_names", allergies.toString());
                const options = {
                method: 'PATCH',
                url: 'https://potluck.herokuapp.com/users/me',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    city: city,
                    dietary_restrictions_names: allergies,
                }
                };
                console.log(options);
            
                axios.request(options).then(function (response) {
                console.log(response.data);
                console.log('click)')
                }).catch(function (error) {
                console.error(error);
                });
            }

    return (
        <>
        <div className="mt-8 flex flex-col items-center justify-center">
            <Typography variant = 'h4' color="blue-gray">Edit your account</Typography>
            <form onSubmit={() => handleUpdate()}>
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
                                <Typography><Checkbox 
                                    onChange={handleCheckboxChange} id="ripple-on" label="Dairy Allergy" value="Dairy Allergy" ripple={true} /></Typography>
                                <Typography><Checkbox    
                                    onChange={handleCheckboxChange} id="ripple-on" label="Egg Allergy" value="Egg Allergy" ripple={false} /></Typography>
                                <Typography><Checkbox    
                                    onChange={handleCheckboxChange} id="ripple-on" label="Tree-nut Allergy" value="Tree-nut Allergy" ripple={false} /></Typography>
                                <Typography><Checkbox
                                    onChange={handleCheckboxChange} id="ripple-on" label="Peanut Allergy" value="Peanut Allergy" ripple={false} /></Typography>
                                <Typography><Checkbox 
                                    onChange={handleCheckboxChange} id="ripple-on" label="Vegetarian" value="Vegetarian" ripple={false} /></Typography>
                                <Typography><Checkbox 
                                    onChange={handleCheckboxChange} id="ripple-on" label="Gluten-Free" value="Gluten-Free" ripple={false} /></Typography>
                                <Typography><Checkbox   
                                    onChange={handleCheckboxChange} id="ripple-on" label="Vegan" value="Vegan" ripple={false} /></Typography>
                            </div>
                        </Fragment>
                    </div>
                <label htmlFor="raised-button-file" className=" text-center">
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
                <Button type="submit" className=" center" fullWidth>Update</Button>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}