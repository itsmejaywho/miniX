import Signup from '../components/signup'

function SignupPage() {
    return(
        <>
            <div className='h-screen w-full bg-[#181818] flex'>
                <div className='w-[40%] h-full '></div>
                <div className='w-[60%] h-full flex items-center justify-center'>
                    <Signup/>
                </div>
            </div>
        </>
    )
}


export default SignupPage;