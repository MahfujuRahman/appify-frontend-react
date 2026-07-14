import { useId, useMemo, useState } from 'react'
import { displayName, isLiked, postImageUrl } from './feedUtils'

function shortDate(value) {
  if (!value) return 'Just now'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function likedBySummary(users = [], count = 0) {
  const names = users.map(displayName).filter(Boolean)

  if (names.length === 0) {
    return count > 0 ? `${count} ${count === 1 ? 'person' : 'people'}` : '0'
  }

  if (count <= 1 || names.length === 1) return names[0]
  if (count === 2 && names.length > 1) return `${names[0]} and ${names[1]}`

  return `${names[0]} and ${count - 1} others`
}

function LikeIcon({ active = false }) {
  return (
    <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={active ? '#1890FF' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3L7 11v11h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 19.68 9H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="#808080" fillRule="evenodd" d="M8 10.667a2.667 2.667 0 0 0 2.667-2.667V3.333a2.667 2.667 0 0 0-5.334 0V8A2.667 2.667 0 0 0 8 10.667zm0 1.333a4 4 0 0 1-4-4H2.667a5.333 5.333 0 0 0 4.666 5.294V15.333h1.334v-2.039A5.333 5.333 0 0 0 13.333 8H12a4 4 0 0 1-4 4z" clipRule="evenodd" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="#808080" fillRule="evenodd" d="M11.333 2H4.667A2.667 2.667 0 0 0 2 4.667v6.666A2.667 2.667 0 0 0 4.667 14h6.666A2.667 2.667 0 0 0 14 11.333V4.667A2.667 2.667 0 0 0 11.333 2zM4.667 3.333h6.666c.737 0 1.334.597 1.334 1.334v5.074l-2.215-2.215a1 1 0 0 0-1.414 0l-.587.586-1.92-1.92a1 1 0 0 0-1.414 0L3.333 9.29V4.667c0-.737.597-1.334 1.334-1.334zM4 11.333l2.667-2.666 1.92 1.92a1 1 0 0 0 1.414 0l.587-.586L12.667 12v-.667c0 .737-.597 1.334-1.334 1.334H4.667A1.334 1.334 0 0 1 3.333 11.333H4z" clipRule="evenodd" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17" aria-hidden="true">
      <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
      <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
      <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
    </svg>
  )
}

function LikedBy({ users = [], count = 0, compact = false }) {
  const [open, setOpen] = useState(false)
  const popoverId = useId()
  const safeCount = Number.isFinite(Number(count)) ? Number(count) : users.length
  const hasLikes = safeCount > 0
  const summary = useMemo(() => likedBySummary(users, safeCount), [safeCount, users])

  return (
    <span className={`feed-liked-by${compact ? ' feed-liked-by--compact' : ''}`}>
      <button
        type="button"
        className="feed-liked-by__button"
        onClick={() => hasLikes && setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={popoverId}
        disabled={!hasLikes}
        title={hasLikes ? `Liked by ${summary}` : 'No likes yet'}
      >
        {compact ? safeCount : summary}
      </button>
      {open ? (
        <span className="feed-liked-by__popover" id={popoverId} role="dialog" aria-label="People who liked this">
          <strong>Liked by</strong>
          {users.length ? (
            <ul>
              {users.map((user) => <li key={user.id || displayName(user)}>{displayName(user) || 'Unknown user'}</li>)}
            </ul>
          ) : (
            <span className="feed-liked-by__empty">{safeCount} {safeCount === 1 ? 'person' : 'people'} liked this.</span>
          )}
        </span>
      ) : null}
    </span>
  )
}

function CommentForm({ value, placeholder, onChange, onSubmit, submitLabel = 'Comment', autoFocus = false }) {
  return (
    <form className="_feed_inner_comment_box" onSubmit={onSubmit}>
      <div className="_feed_inner_comment_box_form">
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <input
              type="text"
              className="form-control _comment_textarea"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              autoFocus={autoFocus}
            />
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon" aria-hidden="true">
          <button className="_feed_inner_comment_box_icon_btn" type="button" tabIndex={-1}><MicIcon /></button>
          <button className="_feed_inner_comment_box_icon_btn" type="button" tabIndex={-1}><ImageIcon /></button>
        </div>
      </div>
    </form>
  )
}

function CommentNode({ postId, comment, currentUser, onToggleLike, onReply }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [reply, setReply] = useState('')
  const liked = isLiked(comment.liked_users, currentUser?.id)

  const submitReply = async (event) => {
    event.preventDefault()
    if (!reply.trim()) return
    await onReply(postId, reply, comment.id)
    setReply('')
    setReplyOpen(false)
  }

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_row">
            <div className="_comment_bubble">
              <div className="_comment_details_top">
                <div className="_comment_name"><h4 className="_comment_name_title">{displayName(comment.user) || 'Unknown user'}</h4></div>
              </div>
              <div className="_comment_status"><p className="_comment_status_text"><span>{comment.body}</span></p></div>
            </div>
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like"><LikeIcon active={liked} /></span>
                <span className="_reaction_heart"><HeartIcon /></span>
              </div>
              <span className="_total"><LikedBy users={comment.liked_users} count={comment.likes_count} compact /></span>
            </div>
          </div>
          <div className="_comment_reply">
            <ul className="_comment_reply_list">
              <li><button type="button" className={liked ? 'feed-action-active' : ''} onClick={() => onToggleLike(postId, comment.id)}>{liked ? 'Unlike' : 'Like'}</button></li>
              <li><button type="button" onClick={() => setReplyOpen((open) => !open)}>Reply</button></li>
              <li><button type="button">Share</button></li>
              <li><span className="_time_link">.{shortDate(comment.created_at)}</span></li>
            </ul>
          </div>
        </div>
        {replyOpen ? (
          <div className="feed-reply-form">
            <CommentForm value={reply} placeholder="Write a reply" onChange={setReply} onSubmit={submitReply} autoFocus />
          </div>
        ) : null}
        {comment.replies?.length ? (
          <div className="feed-comment-children">
            {comment.replies.map((item) => (
              <CommentNode key={item.id} postId={postId} comment={item} currentUser={currentUser} onToggleLike={onToggleLike} onReply={onReply} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function PostCard({ post, currentUser, open, draft, onToggleLike, onToggleComments, onDraftChange, onCreateComment, onToggleCommentLike, onReply }) {
  const liked = isLiked(post.liked_users, currentUser?.id)

  const submitComment = (event) => {
    event.preventDefault()
    onCreateComment(post.id, draft)
  }

  return (
    <article className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image"><img src="/assets/images/post_img.png" alt="" className="_post_img" /></div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{displayName(post.user) || 'Unknown user'}</h4>
              <p className="_feed_inner_timeline_post_box_para">{shortDate(post.created_at)} . <a href="#0" onClick={(event) => event.preventDefault()}>{post.visibility === 'private' ? 'Private' : 'Public'}</a></p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <button type="button" className="_feed_timeline_post_dropdown_link" aria-label="Post options"><DotsIcon /></button>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.body}</h4>
        {post.image_url ? (
          <div className="_feed_inner_timeline_image">
            <img src={postImageUrl(post.image_url)} alt="Post attachment" className="_time_img feed-post-image" />
          </div>
        ) : null}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/assets/images/react_img1.png" alt="" className="_react_img1" />
          <img src="/assets/images/react_img2.png" alt="" className="_react_img" />
          <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count || 0}</p>
          <p className="_feed_inner_timline_para"><LikedBy users={post.liked_users} count={post.likes_count} /></p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1"><button type="button" onClick={() => onToggleComments(post.id)}><span>{post.comments_count || 0}</span> Comment{post.comments_count === 1 ? '' : 's'}</button></p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button className={`_feed_inner_timeline_reaction_emoji _feed_reaction${liked ? ' _feed_reaction_active' : ''}`} type="button" onClick={() => onToggleLike(post.id)}>
          <span className="_feed_inner_timeline_reaction_link"><span><LikeIcon active={liked} /></span>{liked ? 'Unlike' : 'Like'}</span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" type="button" onClick={() => onToggleComments(post.id)}>
          <span className="_feed_inner_timeline_reaction_link"><span><CommentIcon /></span>Comment</span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction" type="button">
          <span className="_feed_inner_timeline_reaction_link"><span><ShareIcon /></span>Share</span>
        </button>
      </div>

      <div className="_feed_inner_timeline_cooment_area">
        <CommentForm value={draft} placeholder="Write a comment" onChange={(value) => onDraftChange(post.id, value)} onSubmit={submitComment} />
      </div>

      <div className="_timline_comment_main">
        {post.comments?.length ? (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt" onClick={() => onToggleComments(post.id)}>{open ? 'Hide comments' : `View ${post.comments.length} previous comments`}</button>
          </div>
        ) : null}
        {open ? post.comments.map((comment) => (
          <CommentNode key={comment.id} postId={post.id} comment={comment} currentUser={currentUser} onToggleLike={onToggleCommentLike} onReply={onReply} />
        )) : null}
      </div>
    </article>
  )
}
