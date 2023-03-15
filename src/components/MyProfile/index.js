import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const myProfileApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {myProfileData: {}, apiStatus: myProfileApiConstants.initial}

  componentDidMount() {
    this.getMyProfileDetails()
  }

  getMyProfileDetails = async () => {
    this.setState({apiStatus: myProfileApiConstants.pending})
    const myProfileApiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(myProfileApiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const data = fetchedData.profile
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
      console.log(updatedData)
      this.setState({
        myProfileData: updatedData,
        apiStatus: myProfileApiConstants.success,
      })
    } else {
      this.setState({apiStatus: myProfileApiConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPostsContainer = (posts, postsCount) => {
    if (postsCount > 0) {
      return (
        <ul className="posts-list">
          {posts.map(eachPost => (
            <li className="post-list-item" key={eachPost.postId}>
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
        <p className="no-posts-text">No Posts Yet</p>
      </div>
    )
  }

  renderMyProfile = () => {
    const {myProfileData} = this.state
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
    } = myProfileData

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
          <p className="posts-text">Posts</p>
        </div>
        {this.renderPostsContainer(posts, postsCount)}
      </div>
    )
  }

  onClickRetry = () => {
    this.getMyProfileDetails()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/saipraveen/image/upload/v1678814534/Insta_share_project_files/alert-triangle_j5iljh.png"
        alt="failure view"
      />
      <h1 className="failure-heading">
        Something went wrong. Please try again
      </h1>
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
      case myProfileApiConstants.pending:
        return this.renderLoader()
      case myProfileApiConstants.success:
        return this.renderMyProfile()
      case myProfileApiConstants.failure:
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
export default MyProfile