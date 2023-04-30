import { useEffect, useContext, useState, Fragment } from "react"
import axios from "axios"
import { AuthContext } from "../context/authcontext"
import { Typography, Button, Input } from "@material-tailwind/react";
import { Button as MButton } from '@mui/material/';
import { Link, useLocation, useNavigate } from "react-router-dom"
import Checkbox from '@mui/material/Checkbox';

export default function EditProfile(){
    const token = useContext(AuthContext)
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPfp] = useState()
    const [city, setCity] = useState(' ')
    const [allergies, setAllergies] = useState([])
    const [allergyList, setAllergyList] = useState('')



    useEffect(() => {
        axios.get(`https://potluck.herokuapp.com/users/me`, {
        headers: {
            'Content-Type': 'applications/json',
            Authorization: token
        }
        }).then((response) => {
            setFirstName(response.data.first_name)
            setLastName(response.data.last_name)
            setCity(response.data.city)
            setAllergies(response.data.dietary_restrictions_names)
        })

        axios.get(`https://potluck.herokuapp.com/dietary-restrictions`, {
            headers: {
                'Content-Type': 'applications/json',
                Authorization: token
            }
        }).then((response) => {
            setAllergyList(response.data)
        })
    }, []) 

   

    function handleCheckboxChange(e) {
        const name = e.target.value;
        const checked = e.target.checked;
        if (allergies.indexOf(name) >= 0) {
            setAllergies(allergies.filter(a => a !== name))
        }
        else {
            setAllergies(allergies.concat(name))
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
        url: 'https://potluck.herokuapp.com/users/me',
        headers: {
            'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
            Authorization: token
        },
        data: form
        };
    
        axios.request(options).then(function (response) {
            navigate("/profile")
        }).catch(function (error) {
            console.error(error);
        });
    }

    function handleUpload(event) {
        setPfp(event.target.files[0])
    }

    if (allergyList.length > 0)
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
                    <AllergyList allergyList={allergyList} allergies={allergies} handleCheckboxChange={handleCheckboxChange} />
                </div>
                <div>
                    <label htmlFor="raised-button-file" className=" text-center">
                        <MButton variant="contained" component="span" sx={{backgroundColor: "#2196f3", fontWeight: 700, fontSize: '.75rem', paddingY: ".75rem", borderRadius: '.5rem' }}>
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
                </div>
                <Button type="submit" className=" center" fullWidth>Update</Button>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}

function AllergyList({allergyList, allergies, handleCheckboxChange}) {
    return( <div className=" border-light-blue-700 border-2 p-4 mb-6">
        <Fragment>
            <Typography variant='h5' className='text-center'>Dietary Restrictions</Typography>
            <div className=" columns-2  justify-center">
                {allergyList.map((a, index) => (
                    <Typography key={index} className='flex  items-center '>
                        <Checkbox className='' checked={allergies.indexOf(a.name) > -1} onChange={handleCheckboxChange} value={a.name} id="ripple-on" />
                        {a.name}
                    </Typography>
                ))}
            </div>
        </Fragment>
    </div>)
}
