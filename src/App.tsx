import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.tsx"
import About from "./pages/About.tsx"
import Songs from "./pages/Songs.tsx"
import Navbar from "./components/Navbar.tsx"
import Song from "./pages/Song.tsx"
function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Songs" element={<Songs />} />
                <Route path="/Songs/:id" element={<Song />} />
            </Routes>
        </>
    )
}

export default App
