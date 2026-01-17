import "../styles/Home.css"
import { useState } from "react"
import { Link } from "react-router-dom"

function Home() {
        const songItems = [
        {
            id: 1,
            title: "song1",
            translation: [
                {
                    language: "en",
                    lyrics: "111sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "222sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
        {
            id: 2,
            title: "song2",
            translation: [
                {
                    language: "en",
                    lyrics: "333sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "444dfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
        {
            id: 3,
            title: "song3",
            translation: [
                {
                    language: "en",
                    lyrics: "555sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "666sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
    ]

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
