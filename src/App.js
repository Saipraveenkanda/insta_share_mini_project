import {Switch, Route} from 'react-router-dom'
import {Component} from 'react'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import MyProfile from './components/MyProfile'
import NotFound from './components/NotFound'

import './App.css'
import InstaShareContext from './context/InstaShareContext'

class App extends Component {
  state = {activeLink: 'HOME'}

  changeActiveButton = value => {
    this.setState({activeLink: value})
  }

  render() {
    const {activeLink} = this.state
    return (
      <InstaShareContext.Provider
        value={{activeLink, changeActiveButton: this.changeActiveButton}}
      >
        <Switch>
          <Route exact path="/login" component={LoginRoute} />
          <ProtectedRoute exact path="/" component={HomeRoute} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <Route component={NotFound} />
        </Switch>
      </InstaShareContext.Provider>
    )
  }
}

export default App
