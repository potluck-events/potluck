import { Avatar } from "@material-tailwind/react"



export default function UserAvatar({ user }) {
  return (
    <Avatar src={user.thumbnail || user.initials} />
  )
}