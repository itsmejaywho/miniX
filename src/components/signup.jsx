import Inputs from '../components/common/signupInputs'
import User from '../assets/user.svg'
import { useState, useEffect } from 'react'
import supabase from '../../supabaseServer/supabase.jsx'
import { useNavigate } from 'react-router-dom'
import Show from '../assets/show.svg'
import NotShow from '../assets/notShow.svg'
import bcrypt from 'bcryptjs'


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
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
 

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

        setIsLoading(true)
        try{
            // Check existing email
            const { data: emailExists, error: emailCheckError } = await supabase
                .from('userInfo')
                .select('id')
                .eq('emailAddress', emailAddress)
                .limit(1)

            if(emailCheckError){
                throw emailCheckError
            }

            if(emailExists && emailExists.length > 0){
                setError('Email is already in use.')
                setIsLoading(false)
                return
            }

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

            // Insert new user
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const { data, error: insertError } = await supabase
                .from('userInfo')
                .insert({
                    firstName: Fname,
                    lastName: Lname,
                    userName: username,
                    emailAddress: emailAddress,
                    password: hashedPassword
                })
                .select()

            if(insertError){
                throw insertError
            }

            console.log(data)
            setSuccess('Account created successfully!')

            setFname('')
            setLname('')
            setUsername('')
            setEmailAddress('')
            setPassword('')
        } catch (err){
            console.log(err)
            setError('Sign up failed. Please try again.')
        } finally {
            setIsLoading(false)
        }


        
    }

    return(
        <>
            <div className='bg-[#282825]  w-[70%] h-[85%] rounded-[15px] px-17 py-10 flex  items-center flex-col gap-6'>
                
                    
               <div className='h-[70%] w-full flex justify-end items-center flex-col gap-6 '>
                     <div className='flex gap-4 w-full'>
                        <Inputs source={User} message='First Name' value={Fname} onChange={handleChange(setFname, {capitalize: true})} />
                        <Inputs source={User} message='Last Name' value={Lname} onChange={handleChange(setLname, {capitalize: true})} />
                    </div>

                    <Inputs message='Username' value={username} onChange={handleChange(setUsername)} />
                    <Inputs message='Email Address' value={emailAddress} onChange={handleChange(setEmailAddress)} />
                    <div className='flex w-full p-2 h-10 bg-[#3a3b36] rounded-[5px] gap-2 items-center '>
                        <Inputs message='Password'  type={showPassword ? 'text' : 'password'}  value={password} onChange={handleChange(setPassword)} />
                        <button className='h-full' onClick={() => setShowPassword(prev => !prev) }> <img className='h-[90%]' src={showPassword ? NotShow : Show } alt="" /></button>
                    </div>
                    



                    <button
                        className={`bg-white w-full text-black p-3 rounded-[10px]${isLoading ? ' opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleAddUser}
                        disabled={isLoading}

                    >
                        {isLoading ? 'Creating…' : 'Create Account'}
                    </button >
               </div>

                <div className=' w-full h-[5%]'>
                    {error && <p className='text-red-400 text-sm'>{error}</p>}
                    {success && <p className='text-green-400 text-sm'>{success}</p>}
                </div>

                <div className='flex gap-1 text-white text-[.7rem] h-[25%] items-end justify-center '>
                    <p>Already have an account?</p>
                    <button className='tracking-[2px] text-amber-300' onClick={()=> navigate('/')}>Login</button>
                </div>
            </div>
        </>
    )
}

export default SignUp;