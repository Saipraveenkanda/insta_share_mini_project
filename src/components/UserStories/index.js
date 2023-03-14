import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import './index.css'

const storiesApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
}

class UserStories extends Component {
  state = {storiesList: [], storyApiStatus: storiesApiConstants.initial}

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({storyApiStatus: storiesApiConstants.pending})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const userStoriesApiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const response = await fetch(userStoriesApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))
      this.setState({
        storiesList: updatedData,
        storyApiStatus: storiesApiConstants.success,
      })
    } else {
      this.setState({storyApiStatus: storiesApiConstants.failure})
    }
  }
  // story_url, user_id, user_name
  // storyUrl, userId, userName

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderApiStatus = () => {
    const {storyApiStatus} = this.state

    switch (storyApiStatus) {
      case storiesApiConstants.pending:
        return this.renderLoader()
      case storiesApiConstants.success:
        return this.renderUserStories()
      case storiesApiConstants.failure:
        return this.renderFailureView() // failure view is pending
      default:
        return null
    }
  }

  renderUserStories = () => {
    const {storiesList} = this.state
    return (
      <Slider {...settings}>
        {storiesList.map(storyItem => {
          const {storyUrl, userId, userName} = storyItem
          return (
            <div className="story-item" key={userId}>
              <img className="story-image" src={storyUrl} alt="user story" />
              <p className="user-name">{userName}</p>
            </div>
          )
        })}
      </Slider>
    )
  }

  render() {
    return <div className="stories-container">{this.renderApiStatus()}</div>
  }
}

export default UserStories
