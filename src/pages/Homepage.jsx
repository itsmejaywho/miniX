import { useState, useEffect } from 'react'
import Navigation from '../components/navigation'
import CreatePost from '../components/common/post'
import UserPost from '../components/common/userpost'
import supabase from '../../supabaseServer/supabase'
import NavigationButton from '../components/common/navigationButton'
import Notif from '../assets/notification.svg'

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
            <div className='flex gap-2 flex-col h-screen'>

                <div className='order-last h-[10%] border-t border-gray-500'>
                {/* FOR NAVIGATION */}
                    <Navigation>
                        
                    </Navigation>
                </div>
                <div className='w-full h-[10%] flex'>
                    <div className='w-[90%] flex items-center p-2 '>
                        <p className='italic text-[1.5rem]'>MiniX</p>
                    </div>
                    <div className='w-[10%] p-2'>
                        <NavigationButton message='Notification' source={Notif}/>
                    </div>
                </div >
                <div className='h-[80%] overflow-auto flex flex-col gap-2 items-center'>
                {/* FOR POST */}
                    {loading ? (
                        <p className='text-white text-center mt-4'>Loading posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <UserPost 
                                key={post.id}
                                user={post.userName}
                                user_post={post.post}
                            />
                        ))
                    ) : (
                        <p className='text-white text-center mt-4'>No posts yet. Be the first to post!</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Homepage;