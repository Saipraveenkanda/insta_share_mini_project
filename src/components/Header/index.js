import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoMdCloseCircle} from 'react-icons/io'
import './index.css'
import InstaShareContext from '../../context/InstaShareContext'

const Header = props => {
  const {
    changeInput,
    onSearchClicked,
    showMobileSearch,
    toggleMenuButton,
    toggleCloseButton,
    showMenu,
  } = props

  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <InstaShareContext.Consumer>
      {value => {
        const {activeLink, changeActiveButton} = value

        const searchClicked = () => {
          changeActiveButton('SEARCH')
          showMobileSearch()
        }

        const activeHome = activeLink === 'HOME' ? 'active' : ''
        const activeProfile = activeLink === 'PROFILE' ? 'active' : ''
        const activeSearch = activeLink === 'SEARCH' ? 'active' : ''

        return (
          <>
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
                    testid="searchIcon"
                  >
                    <FaSearch color="#989898" size={14} />
                  </button>
                </div>
                <ul className="nav-items">
                  <Link to="/" className="link-style">
                    <li
                      className={`nav-item ${activeHome}`}
                      onClick={() => changeActiveButton('HOME')}
                    >
                      Home
                    </li>
                  </Link>
                  <Link to="/my-profile" className="link-style">
                    <li
                      className={`nav-item ${activeProfile}`}
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
                <button
                  type="button"
                  className="menu-button"
                  onClick={toggleMenuButton}
                >
                  <GiHamburgerMenu color="#262626" size={24} />
                </button>
              </div>
            </nav>
            {showMenu && (
              <div className="pop-up-container">
                <ul className="nav-items-mob">
                  <Link to="/" className="link-style">
                    <li
                      className={`nav-item ${activeHome}`}
                      onClick={() => changeActiveButton('HOME')}
                    >
                      Home
                    </li>
                  </Link>
                  <li
                    className={`nav-item ${activeSearch}`}
                    onClick={searchClicked}
                  >
                    Search
                  </li>
                  <Link to="/my-profile" className="link-style">
                    <li
                      className={`nav-item ${activeProfile}`}
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
                    className="close-button"
                    onClick={toggleCloseButton}
                  >
                    <IoMdCloseCircle size={24} />
                  </button>
                </ul>
              </div>
            )}
          </>
        )
      }}
    </InstaShareContext.Consumer>
  )
}
export default withRouter(Header)
