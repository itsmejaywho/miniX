import { useState, useEffect } from 'react'
import Navigation from '../components/navigation'
import CreatePost from '../components/common/post'
import UserPost from '../components/common/userpost'
import PostContainer from '../components/common/postContainer'
import RightPanel from '../components/common/rightPanel'
import supabase from '../../supabaseServer/supabase'

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
        <div className='flex h-screen bg-[#0a0a0a]'>
            {/* Sidebar */}
            <Navigation onCreateClick={() => setShowCreatePost(true)} />

            {/* Main content - center feed */}
            <div className='flex-1 flex flex-col overflow-hidden relative ml-20 lg:ml-0'>
                <div className='flex-1 overflow-auto p-4 flex flex-col items-center gap-4'>
                    {loading ? (
                        <p className='text-white text-center mt-4'>Loading posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <UserPost 
                                key={post.id}
                                postId={post.id}
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

            {/* Right panel */}
            <RightPanel />
        </div>
    )
}

export default Homepage;