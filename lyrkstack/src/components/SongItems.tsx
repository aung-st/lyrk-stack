import {useParams} from "react-router-dom"

const SongItems = () => {
    const {id} = useParams();
    const {title} = useParams();

    return(
        <>
            <h1> {id} {title} </h1>
        </>
    )
}

export default SongItems