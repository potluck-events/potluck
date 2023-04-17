import { Button, Typography, } from "@material-tailwind/react";

export default function Landing() {
    return (
        <>
        <div className="flex justify-evenly mt-2">
            <Button size='lg' className="w-44">
                Log In
            </Button>
            <Button variant="outlined" className="w-44">
                Sign Up
            </Button>
        </div>
        <div className="">
        <Typography className='mx-6 my-6' variant='h1' color='blue'>
            Effortless Party Planning.
        </Typography>
        </div>
        <div className="">
        <Typography className='flex mx-6 my-6' variant='h5' color='black'>
            Welcome to PotLuck <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-1 ml-2">
  <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
</svg>

        </Typography>
        <Typography className='flex mx-6 my-6' variant='paragraph' color='black'>
        Introducing the ultimate party planning app! 
        With our app, you can easily plan and organize 
        your next event with ease. From creating a guest 
        list and sending out invitations to managing RSVPs, 
        needs, and wants - our app has got you covered. 
        Plus, our intuitive design and user-friendly interface 
        make planning your next bash a breeze. With our app, 
        you'll be the party planning pro in no time!
        </Typography>
        </div>
        <div className="flex justify-center">
        <img className='w-3/5 mb-2' src='/temp-img/pexels-pavel-danilyuk-7180617.jpg'></img>
        </div>
        </>

    )
}