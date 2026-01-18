import { useState, useEffect } from 'react'
import Navigation from '../components/navigation'
import CreatePost from '../components/common/post'
import UserPost from '../components/common/userpost'
import supabase from '../../supabaseServer/supabase'

function Homepage(){
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const {data: postsData, error: postsError} = await supabase
                    .from('indivPost')
                    .select('id, post, user_id, date')
                
                if(postsError) throw postsError

                const {data: usersData, error: usersError} = await supabase
                    .from('userInfo')
                    .select('id, userName')
                
                if(usersError) throw usersError

                const userMap = {}
                usersData.forEach(user => {
                    userMap[user.id] = user.userName
                })

                const postsWithUserNames = postsData.map(post => ({
                    ...post,
                    userName: userMap[post.user_id] || 'Unknown User'
                }))

                const sortedPosts = postsWithUserNames.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date)
                })

                setPosts(sortedPosts)
            } catch(error) {
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchPosts()

        const interval = setInterval(fetchPosts, 5000)

        const postsSubscription = supabase
            .channel('indivPost-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'indivPost' },
                () => {
                    fetchPosts()
                }
            )
            .subscribe()

        const userInfoSubscription = supabase
            .channel('userInfo-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'userInfo' },
                () => {
                    fetchPosts()
                }
            )
            .subscribe()

        return () => {
            clearInterval(interval)
            postsSubscription.unsubscribe()
            userInfoSubscription.unsubscribe()
        }
    }, [])

    return(
        <>
            <div className='h-screen flex bg-[#0f0f0f] p-3 overflow-auto hide-scrollbar'>
                <Navigation />
                <div className='w-[83%] h-full'>
                    <div className='overflow-auto hide-scrollbar w-[70%] h-full outline-x outline-gray-700 items-center  flex flex-col'>
                        <CreatePost></CreatePost>
                        {loading ? (
                            <p className='text-white'>Loading posts...</p>
                        ) : (
                            posts.map((post) => (
                                <UserPost  user={post.userName} user_post={post.post} />
                            ))
                        )}
                    </div>
                    <div className='w-[30%] '>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage;