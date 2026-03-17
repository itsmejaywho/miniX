import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/LandingPage.jsx'
import SignUp from '../pages/signupPage.jsx'
import Homepage from '../pages/Homepage.jsx'
import Settings from '../pages/Settings.jsx'
import Navigation from '../components/navigation.jsx'
import { useState } from 'react'
import PostContainer from '../components/common/postContainer.jsx'

function RequireAuth({ children }) {
    const userData = localStorage.getItem('userData')
    if (!userData) return <Navigate to='/' replace />
    return children
}

function AuthLayout({ children }) {
    const [showCreatePost, setShowCreatePost] = useState(false)

    return (
        <div className='flex h-screen' style={{background: 'var(--bg-page)'}}>
            <Navigation
                onCreateClick={() => setShowCreatePost(true)}
                isCreateActive={showCreatePost}
                onCloseCreate={() => setShowCreatePost(false)}
            />
            {children}
            {showCreatePost && (
                <PostContainer onClose={() => setShowCreatePost(false)} />
            )}
        </div>
    )
}

function AppRoute() {
 
  return ( 

    <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/settings' element={<RequireAuth><AuthLayout><Settings /></AuthLayout></RequireAuth>}></Route>
        <Route path='/homepage' element={<RequireAuth><AuthLayout><Homepage /></AuthLayout></RequireAuth>}></Route>
    </Routes>

  )
}

export default AppRoute;
