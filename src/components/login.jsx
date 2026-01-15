import Logo from '../assets/miniLogo.png'
import Inputs from '../components/common/loginInputs.jsx'
import supabase from '../../supabaseServer/supabase.jsx'
import Google from '../assets/google.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'


function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async ()=>{

        if(!email && !password) return alert('email first')

        const {data} = await supabase
        .from('userInfo')
        .select('*')
        .eq('userName', email)
        .limit(1)

        if(data && data.length > 0){
            const user = data[0]
            const passwordMatch = await bcrypt.compare(password, user.password)
            
            if(passwordMatch){
                navigate('/homepage')
                localStorage.setItem('userData', JSON.stringify(user))
                console.log(localStorage)
            } else {
                alert('Invalid credentials')
            }
        } else {
            alert('User not found')
        }
        
        

    }

    return(
        <>
        <div className="h-[60%] w-[30%] bg-[#181818] rounded-[15px] flex flex-col">
            <div className="h-[40%] max-w-full flex flex-col items-center p-1">
                <div className='h-[50%] flex items-center justify-center'>
                    <div className='h-[50%] p-1 rounded-[10px] flex items-center  justify-center bg-[#1e1d1d] outline-[#2d2d2f] outline'>
                        <img src={Logo} alt="" className='h-full' />
                    </div>
                </div>
                <div className='h-[50%] flex flex-col text-white items-center gap-3 '>
                    <p className='text-[1.2rem] tracking-[2px] font-medium'>Welcome Back</p>
                    <p className='text-[.8rem] text-[#3b3b3b] '>Don't have an account yet? 
                        <button className='text-white ml-1' onClick={()=> navigate('/signup')}>
                            Signup
                        </button>
                    </p>
                </div>
            </div>

            <div className='h-[40%] w-full flex flex-col items-center gap-2 text-white ' >
                <Inputs message='Email Address'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                />
                <Inputs message='Password' type='password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                />
                <button className='p-3 w-[90%] bg-[#0172da] rounded-[10px] text-[.8rem] tracking-[4px] mt-2' 
                    onClick={handleLogin}
                >Login</button>
            </div>

            <div className='h-[20%] w-full flex flex-col items-center text-white'>
                <div className=' w-[90%] flex  items-center  justify-evenly '>
                    <hr className="grow border-t border-gray-700" />
                    <p className='ml-1 mr-1 text-[.6rem] font-normal tracking-[2px]'>OR</p>
                    <hr className="grow border-t border-gray-700" />
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;