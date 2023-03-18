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
  state = {userProfileData: {}, apiStatus: userProfileApiConstants.initial}

  componentDidMount() {
    this.getUserProfileDetails()
  }

  getUserProfileDetails = async () => {
    this.setState({apiStatus: userProfileApiConstants.pending})
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
    if (response.ok === true) {
      const data = fetchedData.user_details
      console.log(data)
      const updatedData = {
        followersCount: data.followers_count,
        followingCount: data.following_count,
        id: data.id,
        profilePic: data.profile_pic,
        userBio: data.user_bio,
        userId: data.user_id,
        userName: data.user_name,
        posts: data.posts,
        stories: data.stories,
        postsCount: data.posts_count,
      }
      this.setState({
        userProfileData: updatedData,
        apiStatus: userProfileApiConstants.success,
      })
    } else {
      this.setState({apiStatus: userProfileApiConstants.failure})
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
        {stories.length > 0 ? (
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
        ) : null}
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
    const {apiStatus} = this.state
    switch (apiStatus) {
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
