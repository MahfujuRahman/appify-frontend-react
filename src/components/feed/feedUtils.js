export const STORAGE_BASE = import.meta.env.VITE_STORAGE_BASE_URL || "http://127.0.0.1:8000/storage"

export function extractData(response) {
  const payload = response?.data
  return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload
}

export function displayName(user) {
  return user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || user?.name || ''
}

export function normalizeUser(user) {
  if (!user) return null
  return { id: user.id, first_name: user.first_name || '', last_name: user.last_name || '', full_name: user.full_name || displayName(user), email: user.email || '' }
}

export function normalizeComment(comment) {
  if (!comment) return null
  return {
    id: comment.id, post_id: comment.post_id, parent_id: comment.parent_id, body: comment.body || '', user: normalizeUser(comment.user),
    likes_count: comment.likes_count ?? 0, liked_users: (comment.liked_users || []).map(normalizeUser).filter(Boolean),
    replies_count: comment.replies_count ?? 0, replies: Array.isArray(comment.replies) ? comment.replies.map(normalizeComment).filter(Boolean) : [],
    created_at: comment.created_at || null, updated_at: comment.updated_at || null,
  }
}

export function normalizePost(post) {
  if (!post) return null
  return {
    id: post.id, body: post.body || '', visibility: post.visibility || 'public', image_path: post.image_path || null, image_url: post.image_url || null,
    user: normalizeUser(post.user), likes_count: post.likes_count ?? 0, liked_users: (post.liked_users || []).map(normalizeUser).filter(Boolean),
    comments_count: post.comments_count ?? 0, comments: Array.isArray(post.comments) ? post.comments.map(normalizeComment).filter(Boolean) : [],
    created_at: post.created_at || null, updated_at: post.updated_at || null,
  }
}

export function normalizePosts(response) {
  if (Array.isArray(response)) {
    return response.map(normalizePost).filter(Boolean)
  }

  const data = extractData(response)
  const posts = Array.isArray(data) ? data : data?.data
  return Array.isArray(posts) ? posts.map(normalizePost).filter(Boolean) : []
}

export const normalizePostResponse = (response) => normalizePost(extractData(response))
export const isLiked = (users = [], userId) => users.some((user) => user?.id === userId)
export const postImageUrl = (path) => !path ? '' : /^https?:\/\//.test(path) ? path : `${STORAGE_BASE}/${path}`
export const createTempId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

export function updateCommentTree(comments, commentId, updater) {
  return comments.map((comment) => comment.id === commentId ? updater(comment) : { ...comment, replies: comment.replies?.length ? updateCommentTree(comment.replies, commentId, updater) : comment.replies })
}

export function insertReply(comments, parentId, reply) {
  return comments.map((comment) => comment.id === parentId
    ? { ...comment, replies: [reply, ...(comment.replies || [])], replies_count: (comment.replies_count || 0) + 1 }
    : { ...comment, replies: comment.replies?.length ? insertReply(comment.replies, parentId, reply) : comment.replies })
}

export function optimisticLikePost(post, user) {
  const liked = isLiked(post.liked_users, user.id)
  return { ...post, liked_users: liked ? post.liked_users.filter((item) => item.id !== user.id) : [user, ...post.liked_users], likes_count: Math.max(0, post.likes_count + (liked ? -1 : 1)) }
}

export function optimisticLikeComment(comment, user) {
  const liked = isLiked(comment.liked_users, user.id)
  return { ...comment, liked_users: liked ? comment.liked_users.filter((item) => item.id !== user.id) : [user, ...comment.liked_users], likes_count: Math.max(0, comment.likes_count + (liked ? -1 : 1)) }
}
