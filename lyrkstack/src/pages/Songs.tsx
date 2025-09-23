import "../styles/Songs.css"
import { Link } from "react-router-dom";

function Songs() {

    const songItems = [
        {id: 1, title: "test"},
        {id: 2, title: "test2"},
        {id: 3, title: "test3"}
    ]
    return (
        <>
            <ul>
                {songItems.map((item) => (
                    <li key ={item.id}>
                    <Link to={`${item.id}`}>
                        <h2>{item.title}</h2>
                    </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}



export default Songs
