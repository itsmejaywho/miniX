import Inputs from '../components/common/signupInputs'
import User from '../assets/user.svg'
import Username from '../assets/username.svg'
import { useState } from 'react'
import supabase from '../../supabaseServer/supabase.jsx'


function SignUp(){

    const [Fname, setFname] = useState('')
    const [Lname, setLname] = useState('')
    const [username, setUsername] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

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
            username: username,
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
                    <Inputs source={User} message='First Name' value={Fname} onChange={(e) => setFname(e.target.value)} />
                    <Inputs source={User} message='Last Name' value={Lname} onChange={(e) => setLname(e.target.value)} />
                </div>

                <Inputs message='Username' value={username} onChange={(e)=> setUsername(e.target.value)} />
                <Inputs message='Email Address' value={emailAddress} onChange={(e)=> setEmailAddress(e.target.value)} />
                <Inputs message='Password' value={password} onChange={(e)=> setPassword(e.target.value)} />

                <button className='bg-white text-black p-3 rounded-[10px]' onClick={handleAddUser}>Create Account</button>
            </div>
        </>
    )
}

export default SignUp;