import "../styles/Home.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import * as data from "../data/data.json"

function Home() {

    const songItems = data.songs

    const [songs, setSongs] = useState<{ id: number; title: string }[]>([]);
    const [searchValue, setSearchValue] = useState("Type Something")
    const [searchPerformed, setSearchPerformed] = useState(false); 

    function handleSearchClick() {
        if (searchValue === "" || searchValue === "Type Something") {
            return ;
        }


        const searchFilter = songItems.filter((item) => {
            if (searchValue === "") { return false; }

            const title : string = item.title.toLowerCase(); // Explicitly specify the type here
            if (title
                .includes(searchValue.toLowerCase())){
                return title;
            }

            return false;
        }) 
        

        setSongs(searchFilter)
        setSearchPerformed(true)


    }

    return (
        <>
            <div className="search-container">
                <input 
                    onChange = {e => setSearchValue(e.target.value)}
                    id="search-bar"
                    type="text"
                    name="search"
                    placeholder={searchValue}>
                </input>
                <button onClick={handleSearchClick}>Search</button>
            </div>
            <div className="search-container">
                        <ul className="song-list">
                            {songs.length > 0 ? (
                            songs.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/songs/${item.id}`} state={{ from: { item } }}>
                                        {item.title}
                                    </Link>
                                </li>
                                ))  
                            ) : (
                                searchPerformed && <li>No results found</li>
                            )}
                        </ul>
            </div>
        </>
    )
}

export default Home
