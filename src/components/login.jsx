import supabase from '../../supabaseServer/supabase.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Show from '../assets/show.svg'
import NotShow from '../assets/notShow.svg'
import '../components/cssComponents/loginCss.css'


function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async ()=>{
        setError('')

        if(!username || !password){
            setError('Please enter your username and password.')
            return
        }

        setIsLoading(true)
        try {
            // Look up email by username
            const { data: userRecord, error: lookupError } = await supabase
                .from('userInfo')
                .select('emailAddress')
                .eq('userName', username)
                .limit(1)

            if(lookupError || !userRecord || userRecord.length === 0){
                setError('Username not found.')
                return
            }

            const email = userRecord[0].emailAddress

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if(authError){
                setError(authError.message)
                return
            }

            // Fetch user profile from userInfo
            const { data: userProfile } = await supabase
                .from('userInfo')
                .select('*')
                .eq('auth_id', data.user.id)
                .limit(1)

            if(userProfile && userProfile.length > 0){
                localStorage.setItem('userData', JSON.stringify(userProfile[0]))
                navigate('/homepage')
            } else {
                setError('User profile not found')
            }
        } catch (err) {
            console.log(err)
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className='loginCard'>
            <div className='loginTabToggle'>
                <button className='loginTabInactive' onClick={() => navigate('/signup')}>
                    Sign up
                </button>
                <button className='loginTabActive'>
                    Sign in
                </button>
            </div>

            {/* Heading */}
            <div className='loginHeading'>
                <h1 className='loginTitle'>Welcome back</h1>
                <p className='loginSubtitle'>Sign in to your account</p>
            </div>

            {/* Form fields */}
            <div className='loginFields'>
                {/* Username */}
                <div className='loginInputRow'>
                    <svg className='loginInputIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/>
                    </svg>
                    <input 
                        type='text' 
                        placeholder='Enter your username' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className='loginInput'
                    />
                </div>

                {/* Password */}
                <div className='loginInputRow'>
                    <svg className='loginInputIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/>
                    </svg>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className='loginInput'
                    />
                    <button className='loginShowBtn' onClick={() => setShowPassword(prev => !prev)}>
                        <img className='loginShowIcon' src={showPassword ? NotShow : Show} alt="" />
                    </button>
                </div>
            </div>

            {/* Sign in button */}
            <button
                className={`loginSubmitBtn${isLoading ? ' loading' : ''}`}
                onClick={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Error message */}
            {error && <p className='loginError'>{error}</p>}

            {/* Divider */}
            <div className='loginDivider'>
                <hr className='loginDividerLine' />
                <span className='loginDividerText'>OR SIGN IN WITH</span>
                <hr className='loginDividerLine' />
            </div>

            {/* Social buttons */}
            <div className='loginSocialRow'>
                <button className='loginSocialBtn'>
                    <svg className='loginSocialIcon' viewBox='0 0 24 24'>
                        <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'/>
                        <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                        <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                        <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                    </svg>
                </button>
                <button className='loginSocialBtn'>
                    <svg className='loginSocialIconWhite' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/>
                    </svg>
                </button>
            </div>       
        </div>
    )
}

export default Login;