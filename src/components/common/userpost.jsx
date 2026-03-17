import { useState, useEffect, useMemo } from 'react'
import supabase from '../../../supabaseServer/supabase'

function userpost({postId, userId, user, user_post, user_date}){
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [deleted, setDeleted] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const currentUser = useMemo(() => JSON.parse(localStorage.getItem('userData') || '{}'), [])
    const isOwner = currentUser.id && currentUser.id === userId

    useEffect(() => {
        const fetchLikes = async () => {
            const { data, error } = await supabase
                .from('likes')
                .select('id, user_id')
                .eq('post_id', postId)

            if (!error && data) {
                setLikeCount(data.length)
                setLiked(data.some(like => like.user_id === currentUser.id))
            }
        }
        if (postId) fetchLikes()
    }, [postId, currentUser.id])

    const handleLike = async () => {
        if (!currentUser.id) return

        if (liked) {
            await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id)
            setLiked(false)
            setLikeCount(prev => prev - 1)
        } else {
            await supabase
                .from('likes')
                .insert({ post_id: postId, user_id: currentUser.id })
            setLiked(true)
            setLikeCount(prev => prev + 1)
        }
    }

    const handleDelete = () => {
        setShowConfirm(true)
    }

    const confirmDelete = async () => {
        const { error } = await supabase
            .from('indivPost')
            .delete()
            .eq('id', postId)
            .eq('user_id', currentUser.id)
        if (!error) setDeleted(true)
        setShowConfirm(false)
    }

    if (deleted) return null

    return(
        <div className='w-full max-w-220 min-h-50 rounded-2xl p-6 flex flex-col gap-4' style={{background: 'var(--bg-card)', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-card)'}}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0' style={{background: 'var(--bg-hover)', color: 'var(--text-primary)'}}>
                        {user ? user.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className='font-semibold text-base' style={{color: 'var(--text-primary)'}}>@{user}</p>
                        <p className='text-xs' style={{color: 'var(--text-muted)'}}>{user_date}</p>
                    </div>
                </div>
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        className='p-2 rounded-lg transition-colors cursor-pointer hover:bg-red-500/10'
                        style={{color: 'var(--text-muted)'}}
                        title='Delete post'
                    >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                    </button>
                )}
            </div>
            <p className='text-sm leading-relaxed flex-1' style={{color: 'var(--text-body)'}}>
                {user_post}
            </p>
            {/* Actions */}
            <div className='flex items-center gap-8 pt-2' style={{borderTop: '1px solid var(--border-main)'}}>
                <button className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`} onClick={handleLike}>
                    <svg className='w-5 h-5' fill={liked ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'/>
                    </svg>
                    <span className='text-sm'>{likeCount}</span>
                </button>
                <button className='flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'/>
                    </svg>
                    <span className='text-sm'>0</span>
                </button>
                <button className='flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'/>
                    </svg>
                    <span className='text-sm'>0</span>
                </button>
            </div>

            {/* Delete confirmation toast */}
            {showConfirm && (
                <div className='fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm toast-slide-in'
                    style={{background: 'var(--bg-card)', border: '1px solid var(--border-main)'}}>
                    <svg className='w-5 h-5 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' style={{color: 'var(--text-muted)'}}>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                    <div className='flex-1'>
                        <p className='text-sm font-semibold' style={{color: 'var(--text-primary)'}}>Delete this post?</p>
                        <p className='text-xs mt-0.5' style={{color: 'var(--text-muted)'}}>This action cannot be undone.</p>
                        <div className='flex items-center gap-3 mt-2'>
                            <button onClick={() => setShowConfirm(false)} className='text-xs font-medium cursor-pointer' style={{color: 'var(--text-secondary)'}}>Dismiss</button>
                            <button onClick={confirmDelete} className='text-xs font-bold cursor-pointer text-red-400'>Delete</button>
                        </div>
                    </div>
                    <button onClick={() => setShowConfirm(false)} className='cursor-pointer' style={{color: 'var(--text-muted)'}}>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default userpost