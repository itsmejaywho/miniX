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
            <div className='bg-white h-45 w-[80%]'>
                <input 
                    type="text"
                    value={createPost}
                    onChange={(e) => setCreatePost(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePost()}
                />
                <button className='w-[10%] p-2 bg-black text-white' onClick={handlePost}>save</button>
            </div>
        </>
    )
}

export default post