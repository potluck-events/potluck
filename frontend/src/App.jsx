import { useState } from 'react'
import './styles/App.css'
import { Routes, Route } from 'react-router'
import Header from './components/header'

function App() {
  const [token, setToken] = useState(null)

  return (
    <Routes>
      <Route element={<Header />}>
        <Route path='/' element={token ? <Home /> : <Landing />} />
        
      </Route>
    </Routes>
  )
  
}

export default App
