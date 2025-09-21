import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Songs from './pages/Songs.tsx'
import Navbar from './components/Navbar.tsx'

function App() {
  return (
    <>
     <Navbar />
      <Routes>
        <Route index element={<Home />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Songs" element={<Songs />}/>
      </Routes>
    </>
  )
}

export default App
