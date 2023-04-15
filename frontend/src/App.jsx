import './styles/App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import useLocalStorage from 'react-use-localstorage';
import { AuthContext } from './context/authcontext';
import ProtectedRoute from './components/protectedroute';

function App() {
  const [token, setToken] = useLocalStorage('token', null)

  return (
    <AuthContext.Provider value={token}>
      <Routes>
        <Route element={<Header setToken={setToken} />}>
          <Route path='/' element={token ? <Home /> : <Landing/>} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/sign-up' element={<SignUp setToken={setToken}/>} />
          <Route path='/sign-up' element={<SignUp />} />
          
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
  
}


export default App