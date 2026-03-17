import LoginInput from '../components/login'

function LandingPage(){
    return(
        <div className='min-h-screen w-full flex items-center justify-center p-4' style={{background: 'var(--bg-page)'}}>
            <LoginInput />
        </div>
    )
}

export default LandingPage;