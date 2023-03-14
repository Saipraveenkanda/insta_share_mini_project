import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-bar">
      <div className="website-card">
        <img
          src="https://res.cloudinary.com/saipraveen/image/upload/v1678692656/Insta_share_project_files/insta_share_logo.png"
          alt="website logo"
          className="website-logo"
        />
        <p className="app-name">Insta Share</p>
      </div>
      <div className="nav-items-web">
        <div className="search-container">
          <input
            type="search"
            className="search-style"
            placeholder="Search Caption"
          />
          <button type="button" className="search-button">
            <FaSearch color="#989898" size={14} />
          </button>
        </div>
        <ul className="nav-items">
          <li className="nav-item">Home</li>
          <li className="nav-item">Profile</li>
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </ul>
      </div>
      <div className="nav-items-mobile">
        <button type="button" className="menu-button">
          <GiHamburgerMenu color="#262626" size={24} />
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
