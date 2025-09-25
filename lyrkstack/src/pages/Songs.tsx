import "../styles/Songs.css"
import { Link } from "react-router-dom"

function Songs() {
    const songItems = [
        {
            id: 1,
            title: "song1",
            translation: [
                {
                    language: "en",
                    lyrics: "1sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "1sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
        {
            id: 2,
            title: "song2",
            translation: [
                {
                    language: "en",
                    lyrics: "2sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "2sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
        {
            id: 3,
            title: "song3",
            translation: [
                {
                    language: "en",
                    lyrics: "3sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
                {
                    language: "ne",
                    lyrics: "3sdfffffffffffffffffffffffffffffffff\nasddddddddd\nasdddddddd\nasddddddddd",
                },
            ],
        },
    ]
    return (
        <>
            <ul>
                {songItems.map((item) => (
                    <li key={item.id}>
                        <Link to={`${item.id}`} state={{ from: { item } }}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Songs
