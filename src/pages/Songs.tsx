import "../styles/Songs.css"
import { Link } from "react-router-dom"
import * as data from "../data/data.json"

function Songs() {
    const songItems = data.songs
    return (
        <>
            <ul className="song-list">
                {songItems.map((item) => (
                    <li key={item.id}>
                        <Link to={`/songs/${item.id}`} state={{ from: { item } }}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Songs
