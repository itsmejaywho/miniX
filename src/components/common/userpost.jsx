import { useState, useEffect, useMemo } from 'react'
import supabase from '../../../supabaseServer/supabase'

function userpost({postId, user, user_post, user_date}){
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const currentUser = useMemo(() => JSON.parse(localStorage.getItem('userData') || '{}'), [])

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

    return(
        <div className='w-full max-w-220 min-h-50 bg-[#1c1c1e] rounded-2xl border-l-4 border-[#7c3aed] p-6 flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-base font-semibold flex-shrink-0'>
                        {user ? user.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className='text-white font-semibold text-base'>@{user}</p>
                        <p className='text-gray-500 text-xs'>{user_date}</p>
                    </div>
                </div>
            </div>
            <p className='text-gray-200 text-sm leading-relaxed flex-1'>
                {user_post}
            </p>
            {/* Actions */}
            <div className='flex items-center gap-8 pt-2 border-t border-[#2a2a2e]'>
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
        </div>
    )
}

export default userpost