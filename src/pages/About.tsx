import "../styles/About.css"

function About() {
    return (
        <>
            <div className="about-container">
                <h1>About</h1>
                <p>
                    Hey there! Welcome to Lyrk Stack! Your go-to spot for translating
                    and viewing song lyrics without the noise of a full library of
                    songs that you don't even listen to.
                </p>
                <p>
                    With Lyrk Stack, adding your own translations is a walk in the
                    park! Simply fill out a form on the "Add Song" page where you can
                    easily create new translations by entering your text and
                    selecting the target language. Once you've added your
                    translations, viewing them is just as straightforward. Everything
                    is neatly organized, so you can quickly access and manage your
                    entries. Whether you're updating existing translations or
                    browsing through your collection.
                </p>
                <p>
                    Lyrk Stack makes it super convenient to keep track of all your
                    multilingual content in one place!
                </p>
                <p>
                    <div className="list-wrapper">
                        You can:
                        <ul>
                            <li>Add as many translations as you want to a song.</li>
                            <li>Refine translations for existing lyrics.</li>
                            <li>Export all your song data for a rainy day!</li>
                        </ul>
                    </div>
                </p>
                <p>
                    Disclaimer: This is purely intended for personal use and not for
                    sharing.
                    <br></br>No copyright infringement is intended.
                </p>
                <button>Start Adding Songs!</button>
            </div>
        </>
    )
}

export default About
