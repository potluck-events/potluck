import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  function handleClickLogin() {
    navigate("/login");
  }

  function handleClickSignup() {
    navigate("/sign-up");
  }

  return (
    <>
      <div className="flex justify-center gap-3 mt-2 mx-6">
        <Button
          onClick={handleClickLogin}
          size="lg"
          className="w-44 bg-blue-900"
        >
          Log In
        </Button>
        <Button
          onClick={handleClickSignup}
          variant="outlined"
          className="w-44 text-blue-900 outline-blue-900"
        >
          Sign Up
        </Button>
      </div>
      <div className="">
        <Typography
          className="mx-6 my-6 text-blue-900"
          variant="h2"
          color="blue"
        >
          Effortless Party Planning.
        </Typography>
      </div>
      <div className="">
        <Typography className="flex mx-6 my-6" variant="h5" color="black">
          Welcome to Bash{" "}
          <FontAwesomeIcon className="self-center ml-1" icon={faArrowRight} />
        </Typography>
        <div className="relative overflow-x-clip">
          <img
            className="absolute -top-48 right-0 transform rotate-45 w-1/4 z-10 md:hidden"
            src="/temp-img/image.png"
          />
          <Typography className="mx-6 pb-6" color="black">
            Introducing the ultimate party planning app! With our app, you can
            easily plan and organize your next event with ease. From creating a
            guest list and sending out invitations to managing RSVPs, needs, and
            wants - our app has got you covered. Plus, our intuitive design and
            user-friendly interface make planning your next bash a breeze. With
            our app, you'll be the party planning pro in no time!
          </Typography>
        </div>
      </div>
      <div className="flex justify-center">
        <img
          className="w-80"
          src="https://potluckprofilepics.s3.us-east-2.amazonaws.com/adobestock_306912082_720.jpg"
        ></img>
      </div>
    </>
  );
}
