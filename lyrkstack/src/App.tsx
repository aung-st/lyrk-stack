import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Navbar from './components/Navbar.tsx'

function App() {

  return (
    <>
     <Navbar />

      <Routes>
        
        <Route index element={<Home />}/>
        <Route path="/Home" element={<Home />}/>

      </Routes>
    </>
  )
}

export default App
