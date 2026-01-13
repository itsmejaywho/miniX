import Inputs from '../components/common/signupInputs'
import User from '../assets/user.svg'
import Username from '../assets/username.svg'
import { useState } from 'react'
import supabase from '../../supabaseServer/supabase.jsx'
import { useNavigate } from 'react-router-dom'


function SignUp(){

    const navigate = useNavigate()
    const [Fname, setFname] = useState('')
    const [Lname, setLname] = useState('')
    const [username, setUsername] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
 

    const handleChange = (setWhat, {capitalize = false} = {}) => (e) => {
        let toUpper = e.target.value;

        if(capitalize){
            toUpper = toUpper.charAt(0).toUpperCase() + toUpper.slice(1)
        }

        setWhat(toUpper)
    }

    const handleAddUser = async()=>{
        if(!Fname || !Lname ){
            alert('Please input')
            return
        }

        const {data, error } = await supabase
        .from('userInfo')
        .insert({
            firstName: Fname,
            lastName: Lname,
            userName: username,
            emailAddress: emailAddress,
            password: password
        })
        .select()

        console.log(data)

        if(error){
            console.log(error)
            alert('failed')
        }else{
            alert('success')
        }
    }

    return(
        <>
            <div className='bg-[#282825]  w-[70%] h-[85%] rounded-[15px] px-17 flex flex-col gap-6'>
                <div className='flex gap-4 w-full'>
                    <Inputs source={User} message='First Name' value={Fname} onChange={handleChange(setFname, {capitalize: true})} />
                    <Inputs source={User} message='Last Name' value={Lname} onChange={handleChange(setLname, {capitalize: true})} />
                </div>

                <Inputs message='Username' value={username} onChange={handleChange(setUsername)} />
                <Inputs message='Email Address' value={emailAddress} onChange={handleChange(setEmailAddress)} />
                <Inputs message='Password' value={password} onChange={handleChange(setPassword)} />

                <button className='bg-white text-black p-3 rounded-[10px]' onClick={handleAddUser}>Create Account</button>
                <div className='flex gap-1 text-white text-[.7rem]'>
                    <p>Already have an account?</p>
                    <button className='tracking-[2px] text-amber-300' onClick={()=> navigate('/')}>Login</button>
                </div>
            </div>
        </>
    )
}

export default SignUp;