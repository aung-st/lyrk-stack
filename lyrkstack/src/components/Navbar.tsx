import "../styles/Navbar.css"
import { Link } from "react-router-dom";
import { FaMusic } from "react-icons/fa";

export default function Navbar() {
    return (
      <nav>
          <ul className="navbar">  
                <Link to ='/home'>                
                    <li className="navbar-icon"><a><FaMusic color='black'/></a></li>
                </Link>
                <Link to ='/about'>
                    <li className="navbar-item"><a>About</a></li>
                </Link>

                <Link to ='/songs'>
                    <li className="navbar-item"><a>Songs</a></li>
                </Link>
                <Link to ='/home'>                
                    <li className="navbar-item"><a>Home</a></li>
                </Link>
          </ul>
      </nav>
    );
  }