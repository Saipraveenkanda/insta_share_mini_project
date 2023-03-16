import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import UserStories from '../UserStories'
import PostItem from '../PostItem'
import './index.css'

const postApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

class HomeRoute extends Component {
  state = {
    postsList: [],
    postApiStatus: postApiConstants.initial,
    likedPostIds: [],
  }

  componentDidMount() {
    this.getPostsData()
  }

  getPostsData = async () => {
    this.setState({postApiStatus: postApiConstants.pending})
    const jwtToken = Cookies.get('jwt_token')
    const postsApiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.posts.map(eachPost => ({
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        comments: eachPost.comments.map(eachComment => ({
          userName: eachComment.user_name,
          userId: eachComment.user_id,
          comment: eachComment.comment,
        })),
      }))
      this.setState({
        postsList: updatedData,
        postApiStatus: postApiConstants.success,
      })
    } else {
      this.setState({postApiStatus: postApiConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  likeClicked = async id => {
    const postLikeApiUrl = `https://apis.ccbp.in/insta-share/posts/${id}/like`
    const requestBody = {like_status: true}
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postLikeApiUrl, options)
    const data = await response.json()
    if (data.message === 'Post has been liked') {
      this.setState(prevState => ({
        postsList: prevState.postsList.map(eachPost => {
          if (eachPost.postId === id) {
            const updatedLike = eachPost.likesCount + 1
            return {...eachPost, likesCount: updatedLike}
          }
          return eachPost
        }),
        likedPostIds: [...prevState.likedPostIds, id],
      }))
    }
  }

  unlikeClicked = async id => {
    const {likedPostIds} = this.state
    const updatedLikes = likedPostIds.filter(eachLike => eachLike !== id)
    const postLikeApiUrl = `https://apis.ccbp.in/insta-share/posts/${id}/like`
    const requestBody = {like_status: false}
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postLikeApiUrl, options)
    const data = await response.json()
    if (data.message === 'Post has been disliked') {
      this.setState(prevState => ({
        postsList: prevState.postsList.map(eachPost => {
          if (eachPost.postId === id) {
            const updatedLike = eachPost.likesCount - 1
            return {...eachPost, likesCount: updatedLike}
          }
          return eachPost
        }),
        likedPostIds: updatedLikes,
      }))
    }
  }

  renderPosts = () => {
    const {postsList, likedPostIds} = this.state

    return (
      <ul className="posts-list-container">
        {postsList.map(eachPost => (
          <PostItem
            postItemDetails={eachPost}
            key={eachPost.postId}
            likeClicked={this.likeClicked}
            unlikeClicked={this.unlikeClicked}
            isActive={likedPostIds.includes(eachPost.postId)}
          />
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getPostsData()
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

  renderPostApiStatus = () => {
    const {postApiStatus} = this.state

    switch (postApiStatus) {
      case postApiConstants.pending:
        return this.renderLoader()
      case postApiConstants.success:
        return this.renderPosts()
      case postApiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <UserStories />
          <hr className="line" />
          {this.renderPostApiStatus()}
        </div>
      </>
    )
  }
}
export default HomeRoute
