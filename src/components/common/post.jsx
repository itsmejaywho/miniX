import { useState, useMemo } from 'react'
import supabase from '../../../supabaseServer/supabase'

function post(){
    const [createPost, setCreatePost] = useState('')
    
    const user = useMemo(() => JSON.parse(localStorage.getItem('userData')), [])

    const handlePost = async ()=> {
        if(!createPost.trim()){
            alert('You need to input characters first!')
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
            alert('Failed to create post')
        }
    }

    return(
        <>
            <div className='h-45 w-[80%] text-white flex flex-col shrink-0  gap-1 '>
                <div className='w-full h-[80%] border border-[#2c2e2f] rounded-[15px]'>
                    <textarea 
                        value={createPost}
                        onChange={(e) => setCreatePost(e.target.value)}
                        placeholder={`Whats on your mind, ` + user.firstName + '?'}
                        onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handlePost()}
                        className='w-full h-full p-2 resize-none text-[.8rem] px-4 outline-none'
                        rows="4"
                    />
                </div>
                <div className='w-full h-[20%]  flex justify-end'>
                    <button className='w-[20%] tracking-[2px] flex items-center justify-center bg-white text-black rounded-[10px]' onClick={handlePost}>Post</button>
                </div>
            </div>
        </>
    )
}

export default post