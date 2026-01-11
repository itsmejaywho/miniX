import Inputs from '../components/common/signupInputs'
import User from '../assets/user.svg'
import Username from '../assets/username.svg'
import { useState } from 'react'
import supabase from '../../supabaseServer/supabase.jsx'


function SignUp(){

    const [Fname, setFname] = useState('')
    const [Lname, setLname] = useState('')

    const handleAddUser = async()=>{
        if(!Fname || !Lname ){
            alert('Please input')
            return
        }

        const {data, error } = await supabase
        .from('user')
        .insert({
            name: Fname,
            surname: Lname
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

                <Inputs />
                <Inputs />
                <Inputs />
            </div>
        </>
    )
}

export default SignUp;