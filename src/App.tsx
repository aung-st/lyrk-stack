import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home.tsx"
import About from "./pages/About.tsx"
import Songs from "./pages/Songs.tsx"
import Navbar from "./components/Navbar.tsx"
import Song from "./pages/Song.tsx"
import AddSong from "./pages/AddSong.tsx"

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/songs/:id" element={<Song />} />
                <Route path="/add-song" element={<AddSong />} />
            </Routes>
        </>
    )
}

export default App
