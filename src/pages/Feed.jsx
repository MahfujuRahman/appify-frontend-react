import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import FeedHeader from '../components/feed/FeedHeader'
import { FeedLeftSidebar, FeedRightSidebar } from '../components/feed/FeedSidebars'
import StoryStrip from '../components/feed/StoryStrip'
import PostComposer from '../components/feed/PostComposer'
import PostCard from '../components/feed/PostCard'
import '../components/feed/Feed.css'
import {
  createTempId,
  insertReply,
  normalizeComment,
  normalizePost,
  normalizePostResponse,
  normalizePosts,
  normalizeUser,
  optimisticLikeComment,
  optimisticLikePost,
  updateCommentTree,
} from '../components/feed/feedUtils'

const PAGE_SIZE = 10

function mergeUniquePosts(currentPosts, nextPosts) {
  const seen = new Set(currentPosts.map((post) => post.id))
  const merged = [...currentPosts]

  nextPosts.forEach((post) => {
    if (!seen.has(post.id)) {
      seen.add(post.id)
      merged.push(post)
    }
  })

  return merged
}

export default function Feed({ navigate }) {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [postForm, setPostForm] = useState({ body: '', visibility: 'public', image: null })
  const [commentDrafts, setCommentDrafts] = useState({})
  const [openComments, setOpenComments] = useState({})
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef(null)
  const mountedRef = useRef(true)
  const currentUser = useMemo(() => normalizeUser(user) || { id: null, full_name: '' }, [user])

  const loadPostsPage = useCallback(async (pageNumber, mode = 'replace') => {
    if (!mountedRef.current) return

    setError('')
    if (mode === 'append') {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const response = await api.get('/posts', { params: { page: pageNumber, per_page: PAGE_SIZE } })
      const payload = response?.data || {}
      const nextPosts = normalizePosts(payload)
      const meta = payload.meta || {}

      if (mountedRef.current) {
        setHasMore(pageNumber < (meta.last_page || pageNumber))
        setPage(pageNumber)

        if (mode === 'replace') {
          setPosts(nextPosts)
          setOpenComments({})
        } else {
          setPosts((current) => mergeUniquePosts(current, nextPosts))
        }
      }
    } catch (exception) {
      if (mountedRef.current) {
        setError(exception?.response?.data?.message || 'Unable to load the feed.')
      }
      throw exception
    } finally {
      if (mountedRef.current) {
        if (mode === 'append') {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const timer = window.setTimeout(() => {
      loadPostsPage(1, 'replace').catch(() => { })
    }, 0)
    return () => {
      mountedRef.current = false
      window.clearTimeout(timer)
    }
  }, [loadPostsPage])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMore || loading) return
        loadPostsPage(page + 1, 'append').catch(() => { })
      },
      {
        root: null,
        rootMargin: '400px 0px',
        threshold: 0.1,
      },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, loadPostsPage, page, posts.length])

  const replacePost = (nextPost) => setPosts((current) => (current.some((post) => post.id === nextPost.id) ? current.map((post) => (post.id === nextPost.id ? nextPost : post)) : [nextPost, ...current]))
  const showError = (exception, fallback) => setError(exception?.response?.data?.message || fallback)

  const handleCreatePost = async (event) => {
    event.preventDefault()
    const body = postForm.body.trim()
    if (!body) {
      setError('Please write something before posting.')
      return
    }

    const snapshot = posts
    const tempId = createTempId('post')
    const imageUrl = postForm.image ? URL.createObjectURL(postForm.image) : null

    setSubmitting(true)
    setError('')
    setPosts((current) => [
      normalizePost({
        id: tempId,
        body,
        visibility: postForm.visibility,
        image_url: imageUrl,
        user: currentUser,
        likes_count: 0,
        liked_users: [],
        comments_count: 0,
        comments: [],
        created_at: new Date().toISOString(),
      }),
      ...current,
    ])

    try {
      const payload = new FormData()
      payload.append('body', body)
      payload.append('visibility', postForm.visibility)
      if (postForm.image) payload.append('image', postForm.image)

      const post = normalizePostResponse(await api.post('/posts', payload))
      if (post) {
        setPosts((current) => current.map((item) => (item.id === tempId ? post : item)))
      }
      setPostForm({ body: '', visibility: 'public', image: null })
    } catch (exception) {
      setPosts(snapshot)
      showError(exception, 'Unable to create the post.')
    } finally {
      setSubmitting(false)
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }

  const handleTogglePostLike = async (postId) => {
    const snapshot = posts
    setPosts((current) => current.map((post) => (post.id === postId ? optimisticLikePost(post, currentUser) : post)))

    try {
      const post = normalizePostResponse(await api.post(`/posts/${postId}/like`))
      if (post) replacePost(post)
    } catch (exception) {
      setPosts(snapshot)
      showError(exception, 'Unable to update like state.')
    }
  }

  const handleCreateComment = async (postId, body, parentId = null) => {
    const content = body.trim()
    if (!content) return

    const snapshot = posts
    const tempId = createTempId('comment')
    const comment = normalizeComment({
      id: tempId,
      post_id: postId,
      parent_id: parentId,
      body: content,
      user: currentUser,
      likes_count: 0,
      liked_users: [],
      replies: [],
      created_at: new Date().toISOString(),
    })

    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post
      return parentId
        ? { ...post, comments: insertReply(post.comments, parentId, comment) }
        : { ...post, comments: [comment, ...post.comments], comments_count: post.comments_count + 1 }
    }))

    try {
      const post = normalizePostResponse(await api.post(parentId ? `/comments/${parentId}/replies` : `/posts/${postId}/comments`, { body: content }))
      if (post) replacePost(post)
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      setOpenComments((current) => ({ ...current, [postId]: true }))
    } catch (exception) {
      setPosts(snapshot)
      showError(exception, 'Unable to add the comment.')
    }
  }

  const handleToggleCommentLike = async (postId, commentId) => {
    const snapshot = posts
    setPosts((current) => current.map((post) => (
      post.id === postId
        ? { ...post, comments: updateCommentTree(post.comments, commentId, (comment) => optimisticLikeComment(comment, currentUser)) }
        : post
    )))

    try {
      const post = normalizePostResponse(await api.post(`/comments/${commentId}/like`))
      if (post) replacePost(post)
    } catch (exception) {
      setPosts(snapshot)
      showError(exception, 'Unable to update like state.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', true)
  }

  return (
    <main className={`_layout _layout_main_wrapper feed-page-react${darkMode ? ' _dark_wrapper' : ''}`}>
      <div className="_layout_mode_swithing_btn">
        <button type="button" className="_layout_swithing_btn_link" aria-label="Toggle dark mode" aria-pressed={darkMode} onClick={() => setDarkMode((enabled) => !enabled)}>
          <div className="_layout_swithing_btn"><div className="_layout_swithing_btn_round" /></div>
          <div className="_layout_change_btn_ic1" aria-hidden="true" />
          <div className="_layout_change_btn_ic2" aria-hidden="true" />
        </button>
      </div>
      <div className="_main_layout">
        <FeedHeader user={user} onLogout={handleLogout} />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 feed-desktop-sidebar">
                <FeedLeftSidebar />
              </div>
              <section className="col-xl-6 col-lg-6 col-md-12 col-sm-12" aria-label="Feed">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoryStrip />
                    <PostComposer form={postForm} setForm={setPostForm} submitting={submitting} onSubmit={handleCreatePost} />
                    {error ? <div className="alert alert-danger mb-3">{error}</div> : null}
                    {loading ? <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 text-center">Loading your feed...</div> : null}
                    {!loading && !posts.length ? <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 text-center">No posts yet. Be the first to share something.</div> : null}
                    {posts.map((post, index) => {
                      const targetIndex = Math.max(posts.length - 3, 0)
                      const attachRef = index === targetIndex

                      return (
                        <div key={post.id} ref={attachRef ? sentinelRef : null}>
                          <PostCard
                            post={post}
                            currentUser={currentUser}
                            open={Boolean(openComments[post.id])}
                            draft={commentDrafts[post.id] || ''}
                            onToggleLike={handleTogglePostLike}
                            onToggleComments={(id) => setOpenComments((current) => ({ ...current, [id]: !current[id] }))}
                            onDraftChange={(id, value) => setCommentDrafts((current) => ({ ...current, [id]: value }))}
                            onCreateComment={handleCreateComment}
                            onToggleCommentLike={handleToggleCommentLike}
                            onReply={handleCreateComment}
                          />
                        </div>
                      )
                    })}
                    {loadingMore ? <div className="feed-more">Loading more posts...</div> : null}
                    {!hasMore && posts.length ? <div className="feed-more feed-more--end">You're all caught up.</div> : null}
                  </div>
                </div>
              </section>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 feed-desktop-sidebar">
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
