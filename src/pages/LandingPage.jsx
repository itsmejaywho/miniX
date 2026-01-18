import LoginInput from '../components/login'
import '../components/cssComponents/loginCss.css'

function LandingPage(){
    return(
        <>
            <div className="h-screen min-w-[320px] bg-[#0f0f0f] items-center flex justify-center">
                <LoginInput />
            </div>
        </>
    )
}

export default LandingPage;