import {Switch, Route} from 'react-router-dom'
import {Component} from 'react'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import MyProfile from './components/MyProfile'
import './App.css'
import InstaShareContext from './context/InstaShareContext'
import SearchResults from './components/SearchResults'
import NotFound from './components/NotFound'

class App extends Component {
  state = {input: '', activeLink: 'HOME'}

  onChangeInput = event => {
    this.setState({input: event.target.value})
  }

  changeActiveButton = value => {
    this.setState({activeLink: value})
  }

  render() {
    const {input, activeLink} = this.state
    return (
      <InstaShareContext.Provider
        value={{
          input,
          activeLink,
          onChangeInput: this.onChangeInput,
          changeActiveButton: this.changeActiveButton,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginRoute} />
          <ProtectedRoute exact path="/" component={HomeRoute} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute
            exact
            path="/posts/search/:searchInput"
            component={SearchResults}
          />
          <Route component={NotFound} />
        </Switch>
      </InstaShareContext.Provider>
    )
  }
}

export default App
