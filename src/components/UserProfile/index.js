import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const userProfileApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {userProfileData: {}, UserApiStatus: userProfileApiConstants.initial}

  componentDidMount() {
    this.getUserProfileDetails()
  }

  getUserProfileDetails = async () => {
    this.setState({UserApiStatus: userProfileApiConstants.pending})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const userProfileApiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(userProfileApiUrl, options)
    const fetchedData = await response.json()
    const userData = fetchedData.user_details
    if (response.ok === true) {
      const userProfileUpdated = {
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
        id: userData.id,
        profilePic: userData.profile_pic,
        userBio: userData.user_bio,
        userId: userData.user_id,
        userName: userData.user_name,
        posts: userData.posts,
        stories: userData.stories,
        postsCount: userData.posts_count,
      }
      this.setState({
        userProfileData: userProfileUpdated,
        UserApiStatus: userProfileApiConstants.success,
      })
    } else {
      this.setState({UserApiStatus: userProfileApiConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPostsContainer = (posts, postsCount) => {
    if (postsCount > 0) {
      return (
        <ul className="posts-list">
          {posts.map(eachPost => (
            <li className="post-list-item" key={eachPost.id}>
              <img
                src={eachPost.image}
                alt="user post"
                className="user-post-image"
              />
            </li>
          ))}
        </ul>
      )
    }
    return (
      <div className="no-posts-container">
        <div className="camera-icon-ring">
          <BiCamera size={34} />
        </div>
        <h1 className="no-posts-text">No Posts</h1>
      </div>
    )
  }

  renderUserProfile = () => {
    const {userProfileData} = this.state
    const {
      followersCount,
      followingCount,
      profilePic,
      userBio,
      userName,
      posts,
      stories,
      userId,
      postsCount,
    } = userProfileData

    return (
      <div className="user-profile-container">
        <div className="profile-card">
          <img src={profilePic} alt="user profile" className="profile-pic" />
          <div className="profile-details">
            <h1 className="user-profile-name">{userName}</h1>
            <div className="count-container">
              <img
                src={profilePic}
                alt="user profile"
                className="profile-pic-mobile"
              />
              <div className="count-items">
                <div className="count-card">
                  <p className="posts-count">{postsCount}</p>
                  <p className="normal-text">posts</p>
                </div>
                <div className="count-card">
                  <p className="followers-count">{followersCount}</p>
                  <p className="normal-text">followers</p>
                </div>
                <div className="count-card">
                  <p className="following-count">{followingCount}</p>
                  <p className="normal-text">following</p>
                </div>
              </div>
            </div>
            <p className="user-id">{userId}</p>
            <p className="user-bio">{userBio}</p>
          </div>
        </div>

        <ul className="user-stories-container">
          {stories.map(eachStory => (
            <li className="story-card" key={eachStory.id}>
              <img
                src={eachStory.image}
                alt="user story"
                className="user-story-image"
              />
            </li>
          ))}
        </ul>

        <hr className="user-profile-line" />
        <div className="posts-heading">
          <BsGrid3X3 />
          <h1 className="posts-text">Posts</h1>
        </div>
        {this.renderPostsContainer(posts, postsCount)}
      </div>
    )
  }

  onClickRetry = () => {
    this.getUserProfileDetails()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/saipraveen/image/upload/v1678814534/Insta_share_project_files/alert-triangle_j5iljh.png"
        alt="failure view"
      />
      <p className="failure-heading">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Try again
      </button>
    </div>
  )

  renderApiStatus = () => {
    const {UserApiStatus} = this.state
    switch (UserApiStatus) {
      case userProfileApiConstants.pending:
        return this.renderLoader()
      case userProfileApiConstants.success:
        return this.renderUserProfile()
      case userProfileApiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="user-profile-main-container">
          {this.renderApiStatus()}
        </div>
      </div>
    )
  }
}
export default UserProfile
