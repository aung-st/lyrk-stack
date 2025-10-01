import { useLocation } from "react-router-dom"
import "../styles/Song.css"

function Song() {
    const location = useLocation()
    const { from } = location.state

    const songDetails = from.item
    const buttonList = []

    console.log(songDetails.translation[0])

    // Create a button for every language available including transliterations
    for (let index = 0; index < songDetails.translation.length; index++) {
        buttonList.push(
            <li key={index}>
                <button>{songDetails.translation[index].language}</button>
            </li>,
        )
    }

    return (
        <>  
            <div className="song-header">
                <h1>
                    id: {songDetails.id}: title: {songDetails.title}
                </h1>
            </div>
            <div className="song-wrapper">
            <div className="lyric left">
                    <ul className="button-list">{buttonList}</ul>
                    <h2>{songDetails.translation[0].lyrics}</h2>
            </div>
            <div className="lyric right">
                    <ul className="button-list">{buttonList}</ul>
                    <h2>{songDetails.translation[0].lyrics}</h2>
            </div>
            </div>
        </>
    )
}

export default Song
