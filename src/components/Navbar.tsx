import "../styles/Navbar.css"
import { Link } from "react-router-dom"
import { FaMusic } from "react-icons/fa"

export default function Navbar() {
    return (
        <nav>
            <ul className="navbar">
                <Link to="/home">
                    <li className="navbar-icon">
                        <FaMusic className="icon" />
                    </li>
                </Link>
                <Link to="/settings">
                    <li className="navbar-item">
                        <button>Settings</button>
                    </li>
                </Link>
                <Link to="/about">
                    <li className="navbar-item">
                        <button>About</button>
                    </li>
                </Link>

                <Link to="/songs">
                    <li className="navbar-item">
                        <button>Songs</button>
                    </li>
                </Link>
                <Link to="/add-song">
                    <li className="navbar-item">
                        <button>Add Song</button>
                    </li>
                </Link>
                <Link to="/home">
                    <li className="navbar-item">
                        <button>Home</button>
                    </li>
                </Link>
            </ul>
        </nav>
    )
}
