import Signup from '../components/signup'

function SignupPage() {
    return(
        <>
            <div className='h-screen w-full bg-[#181818] items-center justify-center flex min-w-90 '>
                <div className='hidden w-[40%] h-full sm:flex'></div>
                <div className='w-[90%] sm:w-[60%] h-full flex items-center justify-center'>
                    <Signup/>
                </div>
            </div>
        </>
    )

}


export default SignupPage;