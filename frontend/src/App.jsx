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
import Invitations from './pages/user-invitations';
import RSVPList from './pages/rsvp-list';
import Home from './pages/home'
import useLocalStorageState from 'use-local-storage-state'

function App() {
  const [token, setToken] = useLocalStorageState('token', { defaultValue: null })
  

  return (
    <AuthContext.Provider value={token}>
      <Routes>
        <Route element={<Header setToken={setToken} />}>
          <Route path='/' element={token ? <Home /> : <Landing/>} />
          <Route path='/login' element={!token ? <Login setToken={setToken}/> : <Home />} />
          <Route path='/sign-up' element={!token ? <SignUp setToken={setToken} /> : <Home />} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/invitations' element={<Invitations />} />
            <Route path='/events/new' element={<EventForm />} />
            <Route path='/events/:pk' element={<EventDetails />} />
            <Route path='/events/:pk/edit' element={<EventForm />} />
            <Route path='/events/:pk/invitations' element={<RSVPList />} />
          </Route>
          <Route path='*' element={token ? <Home /> : <Landing/>} />   
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
  
}


export default App