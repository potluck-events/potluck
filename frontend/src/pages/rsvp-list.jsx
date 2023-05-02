import { Typography, Button, Chip } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLink,
  faShare,
  faShareFromSquare,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import InvitationModal from "../components/event-details/invitation-modal";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import UserAvatar from "../components/avatar";
import { Dialog, Transition } from "@headlessui/react";
import { Alert, Collapse, IconButton, Tooltip } from "@mui/material";

export default function RSVPList() {
  const { pk } = useParams();
  const { copyFromPk } = useParams();
  const token = useContext(AuthContext);
  const [inviteModalOpen, setInviteModalOpen] = useState(
    copyFromPk ? true : false
  );
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [invitations, setInvitations] = useState();
  const [event, setEvent] = useState();
  const [refresh, setRefresh] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    //GET invitation data
    let options = {
      method: "GET",
      url: `https://potluck.herokuapp.com/events/${pk}/invitations`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setInvitations(response.data);
      })
      .catch(function (error) {
        console.error(error);
        if (error.response.status === 403) {
          navigate("/page403");
        }
      });

    //GET Event details to fill in title
    options = {
      method: "GET",
      url: `https://potluck.herokuapp.com/events/${pk}`,
      headers: {
        Authorization: token,
      },
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setEvent(response.data);
    });
  }, [refresh]);

  if (invitations && event)
    return (
      <>
        <div
          className="mx-6 cursor-pointer rounded bg-gray-200 w-fit p-1 px-2"
          onClick={() => navigate(`/events/${pk}`)}
        >
          <FontAwesomeIcon className="" icon={faArrowLeft} /> Back
        </div>
        <EventTitle title={event.title} />
        <Invitations invitees={invitations.length} />
        {event.user_is_host && (
          <>
            <InvitationModal
              setInviteModalOpen={setInviteModalOpen}
              inviteModalOpen={inviteModalOpen}
              setRefresh={setRefresh}
            />
            <LinkModal
              event={event}
              setLinkModalOpen={setLinkModalOpen}
              linkModalOpen={linkModalOpen}
            />
            <InviteButton
              setInviteModalOpen={setInviteModalOpen}
              setLinkModalOpen={setLinkModalOpen}
            />
          </>
        )}
        <Responses
          setRefresh={setRefresh}
          event={event}
          header={"Attending"}
          invitations={invitations.filter((i) => i.response === true)}
        />
        <Responses
          setRefresh={setRefresh}
          event={event}
          header={"TBD"}
          invitations={invitations.filter((i) => i.response === null)}
        />
        <Responses
          setRefresh={setRefresh}
          event={event}
          header={"Declined"}
          invitations={invitations.filter((i) => i.response === false)}
        />
      </>
    );
}

function EventTitle({ title }) {
  if (title)
    return (
      <div className="text-center my-2 mx-6" color="black">
        <Typography variant="h3">{title}</Typography>
      </div>
    );
}

function Invitations({ invitees }) {
  return (
    <div className="flex justify-between mx-5 py-2 border-b-2">
      <Typography variant="h4">Invitations</Typography>
      <Typography variant="h4">
        {invitees} Invite{invitees != 1 && "s"}
      </Typography>
    </div>
  );
}

function InviteButton({ setInviteModalOpen, setLinkModalOpen }) {
  return (
    <div className="mx-4 my-4 flex gap-2">
      <Button
        onClick={() => setInviteModalOpen(true)}
        fullWidth
        className="bg-blue-900"
      >
        Invite Guests
      </Button>
      <Button
        onClick={() => setLinkModalOpen(true)}
        className="basis-1/3 p-0 text-blue-900"
        variant="outlined"
      >
        <FontAwesomeIcon icon={faLink} /> Link
      </Button>
    </div>
  );
}

function Responses({ header, invitations, event, setRefresh }) {
  const token = useContext(AuthContext);

  function handleDelete(i) {
    console.log(i);
    const options = {
      method: "DELETE",
      url: `https://potluck.herokuapp.com/invitations/${i.pk}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    axios
      .request(options)
      .then(() => setRefresh((r) => !r))
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div className="mx-5 my-4">
      <Typography variant="h4">{header}</Typography>
      {invitations.length !== 0 ? (
        invitations.map((invitation, idx) => (
          <div key={idx} className="flex items-start relative">
            <UserAvatar user={invitation.guest} />
            <div className="mx-2 my-2">
              {invitation.guest && (
                <Typography variant="paragraph" className="font-semibold">
                  {invitation.guest.full_name}
                </Typography>
              )}
              {(!invitation.guest || event.user_is_host) && (
                <Typography variant="paragraph">
                  Email: {invitation.email}
                </Typography>
              )}
              {event.user_is_host && (
                <FontAwesomeIcon
                  onClick={() => handleDelete(invitation)}
                  className="w-fit absolute top-0 right-3 my-3 cursor-pointer"
                  icon={faXmark}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <Typography variant="paragraph">No guests</Typography>
      )}
    </div>
  );
}

function LinkModal({ event, linkModalOpen, setLinkModalOpen }) {
  const inviteLink = `bash-events.netlify.app/invite-code/${event.invite_code}`;
  const [showCopy, setShowCopy] = useState(false);
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "Bash Event Invitation",
        url: `https://bash-events.netlify.app/invite-code/${event.invite_code}`,
      });
    } else {
      console.log("No navigator.share available");
    }
  }

  function handleCopy() {
    setShowCopy(true);
    navigator.clipboard.writeText(inviteLink);
    setTimeout(() => {
      console.log("hit");
      setShowCopy(false);
    }, 2000);
  }

  return (
    <>
      <Transition appear show={linkModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setLinkModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform flex-wrap overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <Typography variant="h4" className="text-center">
                      Invitation Link
                    </Typography>
                    <Typography variant="paragraph" className="text-center">
                      Send this link to your guests to allow them to RSVP
                      themselves - click the link to copy to the clipboard
                    </Typography>
                  </Dialog.Title>
                  <Collapse in={showCopy}>
                    <Alert>Copied to Clipboard!</Alert>
                  </Collapse>
                  <div
                    className="flex items-center justify-center rounded my-3 bg-gray-200 hover:bg-gray-300 h-20"
                    onClick={handleCopy}
                  >
                    <p className="text-gray-700 text-center">{inviteLink}</p>
                  </div>

                  {navigator.share && (
                    <Button onClick={handleShare} className=" w-full">
                      <FontAwesomeIcon icon={faShareFromSquare} /> Share Invite
                    </Button>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
