import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import Popup from 'reactjs-popup'
import {IoMdCloseCircle} from 'react-icons/io'
import './index.css'

const Header = props => {
  const {changeInput, onSearchClicked, showMobileSearch} = props

  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-bar">
      <Link to="/" className="link-style">
        <div className="website-card">
          <img
            src="https://res.cloudinary.com/saipraveen/image/upload/v1678692656/Insta_share_project_files/insta_share_logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="app-name">Insta Share</h1>
        </div>
      </Link>
      <div className="nav-items-web">
        <div className="search-container">
          <input
            type="search"
            className="search-style"
            placeholder="Search Caption"
            onChange={changeInput}
          />
          <button
            type="button"
            className="search-button"
            onClick={onSearchClicked}
          >
            <FaSearch color="#989898" size={14} />
          </button>
        </div>
        <ul className="nav-items">
          <Link to="/" className="link-style">
            <li className="nav-item">Home</li>
          </Link>
          <Link to="/my-profile" className="link-style">
            <li className="nav-item">Profile</li>
          </Link>
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </ul>
      </div>
      <div className="nav-items-mobile">
        <Popup
          modal
          trigger={
            <button type="button" className="menu-button">
              <GiHamburgerMenu color="#262626" size={24} />
            </button>
          }
          position="top center"
        >
          {close => (
            <div className="pop-up-container">
              <ul className="nav-items">
                <Link to="/" className="link-style">
                  <li className="nav-item">Home</li>
                </Link>
                <li className="nav-item" onClick={showMobileSearch}>
                  Search
                </li>
                <Link to="/my-profile" className="link-style">
                  <li className="nav-item">Profile</li>
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={onLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => close()}
                  className="close-button"
                >
                  <IoMdCloseCircle size={24} />
                </button>
              </ul>
            </div>
          )}
        </Popup>
      </div>
    </nav>
  )
}
export default withRouter(Header)
