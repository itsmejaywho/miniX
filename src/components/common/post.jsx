import { useState, useMemo } from 'react'
import supabase from '../../../supabaseServer/supabase'

function post(){
    const [createPost, setCreatePost] = useState('')
    
    const user = useMemo(() => JSON.parse(localStorage.getItem('userData')), [])

    const handlePost = async ()=> {
        if(!createPost.trim()){
            return
        }

        try {
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
        }
    }

    return(
        <div className='flex flex-col gap-4'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0'>
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <p className='text-white text-sm font-medium'>{user?.firstName} {user?.lastName}</p>
                    <p className='text-gray-400 text-xs'>@{user?.userName}</p>
                </div>
            </div>

            {/* Text area */}
            <textarea 
                value={createPost}
                onChange={(e) => setCreatePost(e.target.value)}
                placeholder={`What's on your mind, ${user?.firstName || 'User'}?`}
                onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handlePost()}
                className='w-full bg-transparent text-white text-sm outline-none resize-none placeholder-gray-500 min-h-[100px]'
                rows="4"
            />

            {/* Footer */}
            <div className='flex items-center justify-between border-t border-[#2a2a2e] pt-3'>
                <p className='text-gray-500 text-xs'>Press Ctrl+Enter to post</p>
                <button 
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${createPost.trim() ? 'bg-[#7c3aed] text-white hover:bg-[#6d28d9]' : 'bg-[#2a2a2e] text-gray-500 cursor-not-allowed'}`}
                    onClick={handlePost}
                    disabled={!createPost.trim()}
                >
                    Post
                </button>
            </div>
        </div>
    )
}

export default post