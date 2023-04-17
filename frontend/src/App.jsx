import './styles/App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './context/authcontext';
import useLocalStorage from 'react-use-localstorage';
import Landing from './pages/landing';
import ProtectedRoute from './components/protectedroute';
import Header from './components/header'
import EventForm from './components/eventform'
import Login from './pages/login';
import SignUp from './pages/signup';
import EventDetails from './pages/eventdetails';
import Invitations from './pages/invitations';
import RSVPList from './pages/rsvplist';

function App() {
  const [token, setToken] = useLocalStorage('token', null)

  return (
    <AuthContext.Provider value={token}>
      <Routes>
        <Route element={<Header setToken={setToken} />}>
          <Route path='/' element={token ? <Home /> : <Landing/>} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/sign-up' element={<SignUp setToken={setToken} />} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/invitations' element={<Invitations />} />
            <Route path='/event/new' element={<EventForm />} />
            <Route path='/event/:pk' element={<EventDetails />} />
            <Route path='/event/:pk/edit' element={<EventForm />} />
            <Route path='/event/:pk/invitations' element={<RSVPList />} />
          </Route>

          
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
  
}


export default App