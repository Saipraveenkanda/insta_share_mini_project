import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/saipraveen/image/upload/v1678692372/Insta_share_project_files/insta_share_login_image_mr4fwe.png"
          alt="website login"
          className="login-image"
        />
        <form className="form-styling" onSubmit={this.onSubmitForm}>
          <img
            src="https://res.cloudinary.com/saipraveen/image/upload/v1678692656/Insta_share_project_files/insta_share_logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="app-name">Insta Share</p>
          <label htmlFor="userName" className="label">
            USERNAME
          </label>
          <input
            type="text"
            id="userName"
            className="input-style"
            placeholder="Enter User Name"
            onChange={this.onChangeUserName}
            value={username}
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="input-style"
            placeholder="Enter Password"
            onChange={this.onChangePassword}
            value={password}
          />
          {showErrorMsg ? <p className="error-msg">{errorMsg}</p> : null}
          {/* render error message here */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}
export default LoginRoute
