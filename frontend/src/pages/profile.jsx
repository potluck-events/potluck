import { Avatar, Button, Chip, Typography } from "@material-tailwind/react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const token = useContext(AuthContext);
  const [user, setUser] = useState("");

  useEffect(() => {
    axios
      .get("https://potluck.herokuapp.com/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (user)
    return (
      <>
        <div className="mt-6 flow-root ">
          <div className="flex justify-end mx-6">
            <Button className=" bg-blue-900">
              <Link className=" self-end" to="/profile/edit">
                Edit Profile
              </Link>
            </Button>
          </div>
          <div className="my-6 mx-6 divide-y divide-gray-500/10">
            <div className="columns-1 flex flex-col mt-8 justify-center">
              <div className="relative self-center rounded-full flex items-center justify-center bg-gray-400 w-40 h-40">
                {user.thumbnail ? (
                  <img
                    src={user.thumbnail}
                    alt="user thumbnail"
                    className="rounded-full h-40 w-40 object-cover"
                  />
                ) : (
                  <p className="text-white font-bold m-1 text-6xl">
                    {user.initials}
                  </p>
                )}
              </div>
              <UserName user={user} />
            </div>
            <div className="py-2">
              <Typography
                variant="paragraph"
                className="text-center"
                color="gray"
              >
                Email:
              </Typography>
              <EmailAddress user={user} />
            </div>
            <div className="py-2">
              <Typography
                variant="paragraph"
                className="text-center"
                color="gray"
              >
                Dietary Restrictions:
              </Typography>
              {user.dietary_restrictions_names.length !== 0 ? (
                <Restrictions user={user} />
              ) : (
                <Link to={"/profile/edit"}>
                  <Typography
                    variant="paragraph"
                    className="text-center text-light-blue-800 italic"
                  >
                    Add Dietary Restrictions
                  </Typography>
                </Link>
              )}
            </div>

            {user.city && (
              <div className="py-2">
                <Typography
                  variant="paragraph"
                  className="text-center"
                  color="gray"
                >
                  Location:
                </Typography>
                <UserLocation user={user} />
              </div>
            )}
          </div>
        </div>
      </>
    );
}

function UserName({ user }) {
  return (
    <div className="py-6 text-center" color="black">
      <Typography variant="h2">
        {user.first_name} {user.last_name}
      </Typography>
    </div>
  );
}

function EmailAddress({ user }) {
  return (
    <div className="text-center" color="black">
      <Typography variant="paragraph" className="font-semibold">
        {user.email}{" "}
      </Typography>
    </div>
  );
}

function UserLocation({ user }) {
  return (
    <div className="text-center mb-5" color="black">
      <Typography variant="paragraph" className="font-semibold">
        {user.city}{" "}
      </Typography>
    </div>
  );
}

function Restrictions({ user }) {
  return (
    <div className="flex gap-3 flex-wrap justify-center max-w-4xl mt-2">
      {user.dietary_restrictions_names.map((r, index) => (
        <div key={index}>
          <Chip value={r} className="bg-amber-500 text-black" />
        </div>
      ))}
    </div>
  );
}
