import { useLocation } from "react-router-dom"
import { useState } from 'react';
import "../styles/Song.css"


function Song() {
    const location = useLocation()
    const { from } = location.state

    const songDetails = from.item



    // State to hold the selected translation index
    const [selectedIndexLeft, setSelectedIndexLeft] = useState(0);

    // Function to handle button clicks
    const handleButtonClickLeft = (index:any) => {
        const newIndex : number = index
        setSelectedIndexLeft(newIndex); // Update selected index
    };

      // State to hold the selected translation index
    const [selectedIndexRight, setSelectedIndexRight] = useState(0);

    // Function to handle button clicks
    const handleButtonClickRight = (index:any) => {
        const newIndex : number = index
        setSelectedIndexRight(newIndex); // Update selected index
    };


    // Create a button for every language available
    const buttonListLeft = songDetails.translation.map((translation:any, index:any) => (
        <li key={index}>
            <button onClick={() => handleButtonClickLeft(index)}>
                {translation.language}
            </button>
        </li>
    ));

        // Create a button for every language available
    const buttonListRight = songDetails.translation.map((translation:any, index:any) => (
        <li key={index}>
            <button onClick={() => handleButtonClickRight(index)}>
                {translation.language}
            </button>
        </li>
    ));


    return (
        <>  
            <div className="song-header">
                <h1>
                    id: {songDetails.id}: title: {songDetails.title}
                </h1>
            </div>
            <div className="song-wrapper">
                <div className="lyric left">
                    <ul className="button-list">{buttonListLeft}</ul>  
                    {/* Display the selected translation */}
                    <h4>
                        {songDetails.translation[selectedIndexLeft]?.lyrics}
                    </h4>        
                </div>
                <div className="lyric right">
                    <ul className="button-list">{buttonListRight}</ul>
                    {/* Display the selected translation */}
                    <h4>{songDetails.translation[selectedIndexRight].lyrics}</h4> 
                </div>
            </div>
        </>
    )
}

export default Song
