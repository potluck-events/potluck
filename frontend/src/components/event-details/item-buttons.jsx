import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useContext } from "react";
import "../styles/eventdetails.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/authcontext";



export function NewItemButton({setItemModalOpen}) {
    return (
        <div className="absolute right-5 bottom-5 z-30">
            <Button onClick={() => setItemModalOpen(true)} className="rounded-full">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" /> New Item            
              </div>
            </Button>
        </div>
    )
}

export function ReserveItemsButton({ items }) {
  const token = useContext(AuthContext)
  
  
  function handleReserve() {
    for (const item of items) {
      const options = {
        method: 'PATCH',
        url: `https://potluck.herokuapp.com/items/${item.pk}/reserved`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }

  return (
    <div className="absolute right-5 bottom-5 z-30">
      <form>
        <Button type="submit" onClick={handleReserve} className="rounded-full">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon icon={faCheck} className="w-5 h-5 mr-2" /> Reserve Items            
          </div>
        </Button>
      </form>
    </div>
  )
}
