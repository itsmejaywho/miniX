import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/LandingPage.jsx'
import SignUp from '../pages/signupPage.jsx'
import Homepage from '../pages/Homepage.jsx'
import Settings from '../pages/Settings.jsx'
import Navigation from '../components/navigation.jsx'
import { useState } from 'react'
import PostContainer from '../components/common/postContainer.jsx'

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
        <Route path='/settings' element={<AuthLayout><Settings /></AuthLayout>}></Route>
        <Route path='/homepage' element={<AuthLayout><Homepage /></AuthLayout>}></Route>
    </Routes>

  )
}

export default AppRoute;
