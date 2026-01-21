import "../styles/Navbar.css"
import { Link } from "react-router-dom"
import { FaMusic } from "react-icons/fa"

export default function Navbar() {
    return (
        <nav>
            <ul className="navbar">
                <Link to="/home">
                    <li className="navbar-icon">
                        <FaMusic color="black" />
                    </li>
                </Link>
                <Link to="/about">
                    <li className="navbar-item">About</li>
                </Link>

                <Link to="/songs">
                    <li className="navbar-item">Songs</li>
                </Link>
                <Link to="/home">
                    <li className="navbar-item">Home</li>
                </Link>
            </ul>
        </nav>
    )
}
