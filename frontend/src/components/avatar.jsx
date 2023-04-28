import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar } from "@material-tailwind/react"



export default function UserAvatar({ user, children }) {
  return (
    <div className="relative self-center rounded-full flex items-center justify-center bg-blue-400 w-8 h-8">
      {user ? user.thumbnail ?
        <img src={user.thumbnail} alt="user thumbnail" className="rounded-full h-8 w-8 object-cover" /> :
        <p className="text-white text-sm font-bold m-1">{user.initials}</p> :
        <FontAwesomeIcon className="text-white" icon={faUser} />}
        {children}
    </div>
  )
}