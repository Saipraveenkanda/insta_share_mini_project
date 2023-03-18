import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {FaSearch} from 'react-icons/fa'
import Header from '../Header'
import PostItem from '../PostItem'
import './index.css'

const postApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}
const storiesApiConstants = {
  initial: 'INITIAl',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}
const searchApiConstants = {
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

class HomeRoute extends Component {
  state = {
    postsList: [],
    searchedPosts: [],
    storiesList: [],
    postApiStatus: postApiConstants.initial,
    likedPostIds: [],
    searchInput: '',
    storyApiStatus: storiesApiConstants.initial,
    showSearchResults: false,
    searchStatus: searchApiConstants.initial,
    emptyScreen: true,
    showMenu: false,
    activeLink: 'HOME',
  }

  componentDidMount() {
    this.setState({showSearchResults: false})
    this.getPostsData()
    this.getUserStories()
  }

  // HOME POSTS API START

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
            return {...eachPost, likesCount: prevState.likesCount - 1}
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

  // HOME POST API END

  // SEARCH FUNCTIONALITY

  getSearchResults = async () => {
    const {searchInput} = this.state
    this.setState({searchStatus: searchApiConstants.pending})
    const jwtToken = Cookies.get('jwt_token')
    const searchApiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(searchApiUrl, options)
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
        searchedPosts: updatedData,
        searchStatus: searchApiConstants.success,
        showSearchResults: true,
        searchInput: '',
      })
    } else {
      this.setState({searchStatus: searchApiConstants.failure})
    }
  }

  changeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClicked = () => {
    this.getSearchResults()
  }

  onSearchSubmitMobile = () => {
    this.setState({emptyScreen: false})
    this.getSearchResults()
  }

  renderSearchLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSearchResultsApi = () => {
    const {searchStatus} = this.state
    switch (searchStatus) {
      case searchApiConstants.pending:
        return this.renderSearchLoader()
      case searchApiConstants.success:
        return this.renderSearchedPosts()
      case searchApiConstants.failure:
        return this.renderSearchFailureView()
      default:
        return null
    }
  }

  renderSearchedPosts = () => {
    const {searchedPosts, likedPostIds} = this.state
    if (searchedPosts.length === 0) {
      return (
        <div className="no-search-found-container">
          <img
            src="https://res.cloudinary.com/saipraveen/image/upload/v1678813144/Insta_share_project_files/Group_wqhzw9.png"
            alt="search not found"
            className="no-search-image"
          />
          <h1 className="search-not-found">Search Not Found</h1>
          <p className="no-search-text">
            Try different keyword or search again
          </p>
        </div>
      )
    }
    return (
      <>
        <h1 className="search-heading">Search Results</h1>
        <ul className="posts-list-container-search">
          {searchedPosts.map(eachPost => (
            <PostItem
              postItemDetails={eachPost}
              key={eachPost.postId}
              likeClicked={this.likeClicked}
              unlikeClicked={this.unlikeClicked}
              isActive={likedPostIds.includes(eachPost.postId)}
            />
          ))}
        </ul>
      </>
    )
  }

  onClickSearchRetry = () => {
    this.getSearchResults()
  }

  renderSearchFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/saipraveen/image/upload/v1678814534/Insta_share_project_files/alert-triangle_j5iljh.png"
        alt="failure view"
      />
      <p className="failure-heading">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickSearchRetry}
      >
        Try again
      </button>
    </div>
  )

  showMobileSearch = () => {
    this.setState({showSearchResults: true})
  }

  renderEmptyScreen = () => (
    <div className="empty-screen-container">
      <img
        src="https://res.cloudinary.com/saipraveen/image/upload/v1678896403/Frame_1473_elfq49.png"
        alt="empty-search"
      />
      <h1 className="empty-search-heading">
        Search Results will be appear here
      </h1>
    </div>
  )

  // SEARCH API END

  // Stories code START

  renderStoriesApiStatus = () => {
    const {storyApiStatus} = this.state

    switch (storyApiStatus) {
      case storiesApiConstants.pending:
        return this.renderStoriesLoader()
      case storiesApiConstants.success:
        return this.renderUserStories()
      case storiesApiConstants.failure:
        return this.renderStoriesFailureView()
      default:
        return null
    }
  }

  renderStoriesLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickRetryStories = () => {
    this.getUserStories()
  }

  renderStoriesFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/saipraveen/image/upload/v1678814534/Insta_share_project_files/alert-triangle_j5iljh.png"
        alt="failure view"
      />
      <p className="failure-heading">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryStories}
      >
        Try again
      </button>
    </div>
  )

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

  // Stories Code END

  toggleMenuButton = () => {
    this.setState({showMenu: true})
  }

  toggleCloseButton = () => {
    this.setState({showMenu: false})
  }

  toggleLink = value => {
    this.setState({activeLink: value})
  }

  render() {
    const {
      showSearchResults,
      searchInput,
      emptyScreen,
      showMenu,
      activeLink,
    } = this.state
    return (
      <>
        <Header
          onSearchClicked={this.onSearchClicked}
          changeInput={this.changeInput}
          showMobileSearch={this.showMobileSearch}
          toggleMenuButton={this.toggleMenuButton}
          showMenu={showMenu}
          toggleCloseButton={this.toggleCloseButton}
          toggleLink={this.toggleLink}
          activeLink={activeLink}
        />
        <div className="home-container">
          {showSearchResults ? (
            <div className="search-results-container">
              <div className="search-container-mob">
                <input
                  type="search"
                  className="search-style-mob"
                  placeholder="Search Caption"
                  onChange={this.changeInput}
                  value={searchInput}
                />

                <button
                  type="button"
                  className="search-button"
                  onClick={this.onSearchSubmitMobile}
                  testid="searchIcon"
                >
                  <FaSearch color="#989898" size={14} />
                </button>
              </div>
              {emptyScreen ? this.renderEmptyScreen() : null}

              {this.renderSearchResultsApi()}
            </div>
          ) : (
            <>
              <div className="stories-container">
                {this.renderStoriesApiStatus()}
              </div>
              <hr className="line" />
              {this.renderPostApiStatus()}
            </>
          )}
        </div>
      </>
    )
  }
}
export default HomeRoute
