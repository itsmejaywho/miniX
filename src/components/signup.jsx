import { useState } from 'react'
import supabase from '../../supabaseServer/supabase.jsx'
import { useNavigate } from 'react-router-dom'
import Show from '../assets/show.svg'
import NotShow from '../assets/notShow.svg'
import '../components/cssComponents/signupCss.css'


function isEmailValid(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function SignUp(){

    const navigate = useNavigate()
    const [Fname, setFname] = useState('')
    const [Lname, setLname] = useState('')
    const [username, setUsername] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (setWhat,  {capitalize = false} = {}) => (e) => {
        let toUpper = e.target.value;

        if(capitalize){
            toUpper = toUpper.charAt(0).toUpperCase() + toUpper.slice(1)
        }

        setWhat(toUpper)
    }

    const handleAddUser = async()=>{
        setError('')
        setSuccess('')

        if(!Fname || !Lname){
            setError('Please enter your first and last name.')
            return
        }

        if(!username){
            setError('Please choose a username.')
            return
        }

        if(!isEmailValid(emailAddress)){
            setError('Please enter a valid email address.')
            return
        }

        if(!password || password.length < 6){
            setError('Password must be at least 6 characters.')
            return
        }

        if(password !== confirmPassword){
            setError('Passwords do not match.')
            return
        }

        setIsLoading(true)
        try{
            // Check if username is already taken
            const { data: usernameExists, error: usernameCheckError } = await supabase
                .from('userInfo')
                .select('id')
                .eq('userName', username)
                .limit(1)

            if(usernameCheckError){
                throw usernameCheckError
            }

            if(usernameExists && usernameExists.length > 0){
                setError('Username is already taken.')
                setIsLoading(false)
                return
            }

            // Sign up with Supabase Auth (trigger creates userInfo profile automatically)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: emailAddress,
                password: password,
                options: {
                    data: {
                        firstName: Fname,
                        lastName: Lname,
                        userName: username
                    }
                }
            })

            if(authError){
                if(authError.message.includes('already registered')){
                    setError('Email is already in use.')
                } else {
                    setError(authError.message)
                }
                setIsLoading(false)
                return
            }

            setSuccess('Account created! Check your email to confirm your account before signing in.')

            setFname('')
            setLname('')
            setUsername('')
            setEmailAddress('')
            setPassword('')
            setConfirmPassword('')
        } catch (err){
            console.log(err)
            setError('Sign up failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className='signupCard'>
            <div className='signupTabToggle'>
                <button className='signupTabActive'>
                    Sign up
                </button>
                <button className='signupTabInactive' onClick={() => navigate('/')}>
                    Sign in
                </button>
            </div>

            {/* Heading */}
            <h1 className='signupTitle'>Create an account</h1>

            {/* Form fields */}
            <div className='signupFields'>
                {/* First + Last name row */}
                <div className='signupNameRow'>
                    <input 
                        type='text' 
                        placeholder='First name' 
                        value={Fname} 
                        onChange={handleChange(setFname, {capitalize: true})}
                        className='signupNameInput'
                    />
                    <input 
                        type='text' 
                        placeholder='Last name' 
                        value={Lname} 
                        onChange={handleChange(setLname, {capitalize: true})}
                        className='signupNameInput'
                    />
                </div>

                {/* Username */}
                <input 
                    type='text' 
                    placeholder='Username' 
                    value={username} 
                    onChange={handleChange(setUsername)}
                    className='signupFullInput'
                />

                {/* Email */}
                <div className='signupInputRow'>
                    <svg className='signupInputIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/>
                    </svg>
                    <input 
                        type='email' 
                        placeholder='Enter your email' 
                        value={emailAddress} 
                        onChange={handleChange(setEmailAddress)}
                        className='signupInput'
                    />
                </div>

                {/* Password */}
                <div className='signupInputRow'>
                    <svg className='signupInputIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/>
                    </svg>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Password' 
                        value={password} 
                        onChange={handleChange(setPassword)}
                        className='signupInput'
                    />
                    <button className='signupShowBtn' onClick={() => setShowPassword(prev => !prev)}>
                        <img className='signupShowIcon' src={showPassword ? NotShow : Show} alt="" />
                    </button>
                </div>

                {/* Confirm Password */}
                <div className='signupInputRow'>
                    <svg className='signupInputIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'/>
                    </svg>
                    <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder='Confirm password' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='signupInput'
                    />
                    <button className='signupShowBtn' onClick={() => setShowConfirmPassword(prev => !prev)}>
                        <img className='signupShowIcon' src={showConfirmPassword ? NotShow : Show} alt="" />
                    </button>
                </div>
                
                {/* Password match indicator */}
                {confirmPassword && (
                    <p className={`signupMatchText ${password === confirmPassword ? 'signupMatchValid' : 'signupMatchInvalid'}`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                )}
            </div>

            {/* Create button */}
            <button
                className={`signupSubmitBtn${isLoading ? ' loading' : ''}`}
                onClick={handleAddUser}
                disabled={isLoading}
            >
                {isLoading ? 'Creating…' : 'Create an account'}
            </button>

            {/* Error / Success messages */}
            {error && <p className='signupError'>{error}</p>}
            {success && <p className='signupSuccess'>{success}</p>}

            {/* Divider */}
            <div className='signupDivider'>
                <hr className='signupDividerLine' />
                <span className='signupDividerText'>OR SIGN IN WITH</span>
                <hr className='signupDividerLine' />
            </div>

            {/* Social buttons */}
            <div className='signupSocialRow'>
                <button className='signupSocialBtn'>
                    <svg className='signupSocialIcon' viewBox='0 0 24 24'>
                        <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'/>
                        <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                        <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                        <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                    </svg>
                </button>
                <button className='signupSocialBtn'>
                    <svg className='signupSocialIconWhite' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/>
                    </svg>
                </button>
            </div>

        </div>
    )
}

export default SignUp;