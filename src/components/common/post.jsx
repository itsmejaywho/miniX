import { useState, useMemo } from 'react'
import supabase from '../../../supabaseServer/supabase'

function post(){
    const [createPost, setCreatePost] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    
    const user = useMemo(() => JSON.parse(localStorage.getItem('userData')), [])

    const handlePost = async ()=> {
        if(!createPost.trim() || isPosting) return

        setIsPosting(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                console.error('Not authenticated')
                return
            }

            const {error} = await supabase
            .from('indivPost')
            .insert({
                user_id: user.id,
                post: createPost
            })

            if(error){
                throw error
            }
            setCreatePost('')
        } catch(error) {
            console.error('Error posting:', error)
        } finally {
            setIsPosting(false)
        }
    }

    return(
        <div className='flex flex-col gap-4'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0' style={{background: 'var(--bg-hover)', color: 'var(--text-primary)'}}>
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <p className='text-sm font-medium' style={{color: 'var(--text-primary)'}}>{user?.firstName} {user?.lastName}</p>
                    <p className='text-xs' style={{color: 'var(--text-secondary)'}}>@{user?.userName}</p>
                </div>
            </div>

            {/* Text area */}
            <textarea 
                value={createPost}
                onChange={(e) => setCreatePost(e.target.value)}
                placeholder={`What's on your mind, ${user?.firstName || 'User'}?`}
                onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handlePost()}
                className='w-full bg-transparent text-sm outline-none resize-none min-h-[100px]'
                style={{color: 'var(--text-primary)', '--tw-placeholder-opacity': 1}}
                rows="4"
            />

            {/* Footer */}
            <div className='flex items-center justify-between pt-3' style={{borderTop: '1px solid var(--border-main)'}}>
                <p className='text-xs' style={{color: 'var(--text-muted)'}}>Press Ctrl+Enter to post</p>
                <button 
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${createPost.trim() && !isPosting ? 'hover:opacity-80' : 'cursor-not-allowed'}`}
                    style={{background: createPost.trim() && !isPosting ? 'var(--text-primary)' : 'var(--bg-input)', color: createPost.trim() && !isPosting ? 'var(--bg-page)' : 'var(--text-muted)'}}
                    onClick={handlePost}
                    disabled={!createPost.trim() || isPosting}
                >
                    {isPosting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </div>
    )
}

export default post