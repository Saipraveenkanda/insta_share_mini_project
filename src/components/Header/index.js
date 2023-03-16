import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import Popup from 'reactjs-popup'
import {IoMdCloseCircle} from 'react-icons/io'
import './index.css'
import InstaShareContext from '../../context/InstaShareContext'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <InstaShareContext.Consumer>
      {value => {
        const {onChangeInput, input, activeLink, changeActiveButton} = value
        const homeClass = activeLink === 'HOME' ? 'home-active' : ''
        const profileClass = activeLink === 'PROFILE' ? 'home-active' : ''
        const searchClass = activeLink === 'SEARCH' ? 'home-active' : ''

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
                  onChange={onChangeInput}
                />
                <Link to={`/posts/search/${input}`}>
                  <button
                    type="button"
                    className="search-button"
                    testid="searchIcon"
                  >
                    <FaSearch color="#989898" size={14} />
                  </button>
                </Link>
              </div>
              <ul className="nav-items">
                <Link to="/" className="link-style">
                  <li
                    className={`nav-item ${homeClass}`}
                    onClick={() => changeActiveButton('HOME')}
                  >
                    Home
                  </li>
                </Link>
                <Link to="/my-profile" className="link-style">
                  <li
                    className={`nav-item ${profileClass}`}
                    onClick={() => changeActiveButton('PROFILE')}
                  >
                    Profile
                  </li>
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={onLogout}
                >
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
                        <li
                          className={`nav-item ${homeClass}`}
                          onClick={() => changeActiveButton('HOME')}
                        >
                          Home
                        </li>
                      </Link>
                      <Link to="/posts/search-mobile" className="link-style">
                        <li
                          className={`nav-item ${searchClass}`}
                          onClick={() => changeActiveButton('SEARCH')}
                        >
                          Search
                        </li>
                      </Link>
                      <Link to="/my-profile" className="link-style">
                        <li
                          className={`nav-item ${profileClass}`}
                          onClick={() => changeActiveButton('PROFILE')}
                        >
                          Profile
                        </li>
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
      }}
    </InstaShareContext.Consumer>
  )
}
export default withRouter(Header)
