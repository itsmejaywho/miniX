import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/LandingPage.jsx'
import SignUp from '../pages/signupPage.jsx'
import Homepage from '../pages/Homepage.jsx'
import Settings from '../pages/Settings.jsx'

function AppRoute() {
 
  return ( 

    <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/homepage' element={<Homepage />}></Route>
    </Routes>

  )
}

export default AppRoute;
