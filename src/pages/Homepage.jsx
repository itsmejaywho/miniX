import { useState, useEffect } from 'react'
import Navigation from '../components/navigation'
import CreatePost from '../components/common/post'
import UserPost from '../components/common/userpost'
import PostContainer from '../components/common/postContainer'
import supabase from '../../supabaseServer/supabase'
import NavigationButton from '../components/common/navigationButton'
import Notif from '../assets/notification.svg'

function Homepage(){
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreatePost, setShowCreatePost] = useState(false)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' }
        const dateFormatted = date.toLocaleDateString('en-US', options)
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' })
        return `${dateFormatted}: ${time}`
    }

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
                    <Navigation onCreateClick={() => setShowCreatePost(true)}>
                        
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
                <div className='h-[80%] w-full overflow-auto gap-4 flex flex-col items-center'>
                {/* FOR POST */}
                    {loading ? (
                        <p className='text-white text-center mt-4'>Loading posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <UserPost 
                                key={post.id}
                                user={post.userName}
                                user_post={post.post}
                                user_date={formatDate(post.date)}
                            />
                        ))
                    ) : (
                        <p className='text-white text-center mt-4'>No posts yet. Be the first to post!</p>
                    )}
                </div>
                {showCreatePost && (
                    <PostContainer onClose={() => setShowCreatePost(false)} />
                )}
            </div>
        </>
    )
}

export default Homepage;