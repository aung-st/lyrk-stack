import "../styles/Home.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Home() {
    const [songs, setSongs] = useState<
        {
            song_id: number
            song_title: string
            artist_id: number
            album_id: number
        }[]
    >([])
    const [searchValue, setSearchValue] = useState("Type Something")
    const [searchPerformed, setSearchPerformed] = useState(false)

    const fetchData = async () => {
        const response: any = await axios.get("http://localhost:3000/api/data/songs")
        setSongs(response.data.songs)
        console.log(response.data.songs[0].song_id)
    }

    useEffect(() => {
        fetchData()
    }, [])

    function handleSearchClick() {
        if (searchValue === "" || searchValue === "Type Something") {
            return
        }

        const searchFilter = songs.filter((item) => {
            if (searchValue === "") {
                return false
            }

            const title: string = item.song_title.toLowerCase()
            if (title.includes(searchValue.toLowerCase())) {
                return title
            }

            return false
        })

        setSongs(searchFilter)
        setSearchPerformed(true)
    }

    return (
        <>
            <div className="search-container">
                <input
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="search-bar"
                    type="text"
                    name="search"
                    placeholder={searchValue}
                ></input>
                <button onClick={handleSearchClick}>Search</button>
            </div>
            <div className="search-container">
                <ul className="song-list">
                    {songs.length > 0 && searchPerformed
                        ? songs.map((item) => (
                              <li key={item.song_id}>
                                  <Link
                                      to={`/songs/${item.song_id}`}
                                      state={{ from: { item } }}
                                  >
                                      {item.song_title}
                                  </Link>
                              </li>
                          ))
                        : searchPerformed && <li>No results found</li>}
                </ul>
            </div>
        </>
    )
}

export default Home
