import { useLocation } from "react-router-dom"
import "../styles/Song.css"


function Song() {
    const location = useLocation()
    const { from } = location.state

    const songDetails = from.item
    const buttonList = []


    // Create a button for every language available including transliterations
    for (let index = 0; index < songDetails.translation.length; index++) {
        buttonList.push(
            <li key={index}>
                <button>{songDetails.translation[index].language}</button>
            </li>,
        )
    }

    // change translation text in h4 tag depending on what button you press and the index of that button in the button list relative to translations in song details
    function toggleTranslation(){
        let button = document.querySelectorAll(".button-list")
        console.log(button)
    }
    
    return (
        <>  
            <div className="song-header">
                <h1>
                    id: {songDetails.id}: title: {songDetails.title}
                </h1>
            </div>
            <div className="song-wrapper" onClick = {toggleTranslation}>
                <div className="lyric left">
                    <ul className="button-list">{buttonList}</ul>
                    <h4>{songDetails.translation[0].lyrics}</h4>
                </div>
                <div className="lyric right">
                    <ul className="button-list">{buttonList}</ul>
                    <h4>{songDetails.translation[0].lyrics}</h4>
                </div>
            </div>
        </>
    )
}

export default Song
