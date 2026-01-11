import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/LandingPage.jsx'
import SignUp from '../pages/signupPage.jsx'

function AppRoute() {
 
  return ( 

    <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
    </Routes>

  )
}

export default AppRoute;
