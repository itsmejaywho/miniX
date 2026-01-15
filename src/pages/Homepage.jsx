import Navigation from '../components/navigation'
import CreatePost from '../components/common/post'

function Homepage(){

    return(
        <>
            <div className='h-screen flex bg-[#0f0f0f] p-3'>
                <Navigation />
                <div className='w-[83%] h-full outline outline-red-100'>
                    <div className='w-[70%] h-full outline outline-red-200 flex flex-col items-center'>
                        <CreatePost></CreatePost>


                    </div>
                    <div className='w-[30%] h-full'>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage;