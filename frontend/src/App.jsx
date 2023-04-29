import './styles/App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './context/authcontext';
import Landing from './pages/landing';
import ProtectedRoute from './components/protected-route';
import Header from './components/header'
import EventForm from './pages/event-form'
import Login from './pages/login';
import SignUp from './pages/signup';
import EventDetails from './pages/event-details';
import UserInvitations from './pages/user-invitations';
import RSVPList from './pages/rsvp-list';
import Home from './pages/home'
import useLocalStorageState from 'use-local-storage-state'
import { Error404, Error403 } from './pages/error-pages'
import Profile from './pages/profile';
import EditProfile from './pages/edit-profile';
import InviteCodeRedirect from './pages/invite-code';
import Spotify from './components/event-details/spotify';
import Notifications from './pages/notifications';
import PasswordReset from './pages/password-reset';


function App() {
  const [token, setToken] = useLocalStorageState('token', { defaultValue: null })
  const [itemsTabOpen, setItemsTabOpen] = useLocalStorageState('itemsTabOpen', { defaultValue: true }) //Is the "tab" on items?
  const [spotifyEventPk, setSpotifyEventPk] = useLocalStorageState('spotifyEventPk', { defaultValue: null })
  

  return (
    <AuthContext.Provider value={token}>
      <Routes>
        <Route element={<Header setToken={setToken} />}>
          <Route path='/' element={token ? <Home setItemsTabOpen={setItemsTabOpen} /> : <Landing/>} />
          <Route path='/login' element={!token ? <Login setToken={setToken}/> : <Home />} />
          <Route path='/sign-up' element={!token ? <SignUp setToken={setToken} /> : <Home />} />
          <Route path='/password-reset' element={<PasswordReset />} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/invitations' element={<UserInvitations />} />
            <Route path='/invite-code/:code' element={<InviteCodeRedirect />} />
            <Route path='/events/new' element={<EventForm setSpotifyEventPk={setSpotifyEventPk} />} />
            <Route path='/events/:pk' element={<EventDetails itemsTabOpen={itemsTabOpen} setItemsTabOpen={setItemsTabOpen} />} />
            <Route path='/events/:pk/edit' element={<EventForm setSpotifyEventPk={setSpotifyEventPk} />} />
            <Route path='/events/:pk/copy' element={<EventForm setSpotifyEventPk={setSpotifyEventPk} />} />
            <Route path='/events/:pk/invitations' element={<RSVPList />} />
            <Route path='/events/:pk/invitations/:copyFromPk' element={<RSVPList />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/edit' element={<EditProfile />} />
            <Route path='/spotify' element={<Spotify spotifyEventPk={spotifyEventPk} />} />
            <Route path='/notifications' element={<Notifications />} />
          </Route>
          <Route path='/page404' element={<Error404 />}/>
          <Route path='/page403' element={<Error403 />}/>
          <Route path='*' element={<Error404 />} />   
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
  
}


export default App