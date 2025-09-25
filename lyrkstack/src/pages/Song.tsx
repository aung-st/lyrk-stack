import { useLocation } from 'react-router-dom'

function Song() {
    const location = useLocation()
    const { from } = location.state

    const songDetails = from.item
    const buttonList = [] 

    console.log(songDetails.translation[0])

    // Create a button for every language available including transliterations
    for (let index = 0; index < songDetails.translation.length; index++){
        buttonList.push(
        <li key={index}>
            <button>
                {songDetails.translation[index].language}
            </button>
        </li>
        )
    }

    return (
        <>
            <h1>id: {songDetails.id}: title: {songDetails.title}</h1>
            <ul>{buttonList}</ul>
            <h2>{songDetails.lyrics}</h2>
        </>
    )
}



export default Song