import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

export default function Spotify() {
  const [userInfo, setUserInfo] = useState();
  const clientId = "fb2988ad523142b1a493ee09f914a44a"; // Replace with your client ID
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const userToken = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [spotifyEventPk, setSpotifyEventPk] = useLocalStorageState(
    "spotifyEventPk",
    { defaultValue: null }
  );
  const [copyPk, setCopyPk] = useLocalStorageState("copyPk", {
    defaultValue: null,
  });

  useEffect(() => {
    if (location.state?.eventPk) setSpotifyEventPk(location.state.eventPk);
    if (location.state?.copyPk) setCopyPk(location.state.copyPk);

    axios
      .get(
        `https://potluck.herokuapp.com/events/${
          location.state?.eventPk || spotifyEventPk
        }`,
        {
          headers: {
            "Content-Type": "applications/json",
            Authorization: userToken,
          },
        }
      )
      .then((response) => {
        setTitle(response.data.title);
        setDescription(response.data.description);
        getSpotify(response.data.title, response.data.description);
      });

    async function getSpotify(title, description) {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        setUserInfo(profile);
        const playlist = await createPlaylist(
          accessToken,
          profile,
          title,
          description
        );

        setPlaylist(playlist, spotifyEventPk, userToken, navigate, copyPk);
      }
    }
  }, []);

  return null;
}

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append(
    "redirect_uri",
    window.location.hostname.includes("bash")
      ? "https://bash-events.netlify.app/spotify"
      : "http://localhost:5173/spotify"
  );
  params.append(
    "scope",
    "user-read-private user-read-email playlist-modify-private playlist-modify-public"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append(
    "redirect_uri",
    window.location.hostname.includes("bash")
      ? "https://bash-events.netlify.app/spotify"
      : "http://localhost:5173/spotify"
  );
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

async function createPlaylist(token, profile, title, description) {
  const options = {
    method: "POST",
    url: `https://api.spotify.com/v1/users/${profile.id}/playlists`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: title,
      description: description,
      public: true,
      collaborative: false,
    },
  };
  const result = await axios.request(options);

  return await result.data;
}

function setPlaylist(playlist, pk, token, navigate, copyPk) {
  const options = {
    method: "PATCH",
    url: `https://potluck.herokuapp.com/events/${pk}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: {
      playlist_link: playlist.external_urls.spotify,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      if (copyPk) navigate(`/events/${response.data.pk}/invitations/${copyPk}`);
      else navigate(`/events/${response.data.pk}`);
    })
    .catch(function (error) {
      console.error(error);
    });
}
