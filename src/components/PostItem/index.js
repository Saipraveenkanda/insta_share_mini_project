import {BiShareAlt} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import './index.css'

const PostItem = props => {
  const {postItemDetails, likeClicked, isActive, unlikeClicked} = props
  const {
    createdAt,
    likesCount,
    postId,
    profilePic,
    // userId,
    userName,
    postDetails,
    comments,
  } = postItemDetails
  const {caption, imageUrl} = postDetails

  const onClickLike = () => {
    likeClicked(postId)
  }

  const onClickUnlike = () => {
    unlikeClicked(postId)
  }

  return (
    <li className="post-container">
      <div className="name-card">
        <div className="profile-pic-container">
          <img
            src={profilePic}
            alt="post author profile"
            className="post-author-profile"
          />
        </div>
        <p className="post-author-name">{userName}</p>
      </div>
      <img src={imageUrl} alt="post" className="post-image" />
      <div className="like-comment-container">
        <div className="like-comment-icons">
          {isActive ? (
            <button
              type="button"
              className="unlike-button"
              onClick={onClickUnlike}
            >
              <FcLike size={26} />
            </button>
          ) : (
            <button type="button" className="like-icon" onClick={onClickLike}>
              <BsHeart size={24} color="#475569" className="like-state" />
            </button>
          )}
          <button type="button" className="like-icon">
            <FaRegComment size={24} color="#475569" />
          </button>
          <button type="button" className="like-icon">
            <BiShareAlt size={24} color="#475569" />
          </button>
        </div>
        <div className="caption-comments-card">
          <p className="likes">{likesCount} likes</p>
          <p className="caption">{caption}</p>
          <ul className="comments-container">
            {comments.map(eachComment => (
              <li key={eachComment.userId} className="comment-list-item">
                <p className="comment-author">{eachComment.userName}</p>
                <p className="comment">{eachComment.comment}</p>
              </li>
            ))}
          </ul>
          <p className="created-at">{createdAt}</p>
        </div>
      </div>
    </li>
  )
}
export default PostItem
