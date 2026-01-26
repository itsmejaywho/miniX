import Profile from '../../assets/profle.jpg'

function userpost({user, user_post, user_date}){
    return(
        <>
            <div className='border flex border-[#36424e] w-[80%] h-[200px] shrink-0'>
                <div className=' h-full w-[20%] flex p-2'>
                    <div className='h-[40px] w-[40px]] rounded-full  overflow-hidden flex items-center justify-center'>
                        <img src={Profile} alt="" className='w-full h-full object-cover' />
                    </div>
                </div>

                <div className='flex flex-col gap-3 p-2 w-[80%]  '>
                    <div className='flex flex-col h-[40px] '>
                        <p className='text-[1rem] font-bold'>{user}</p>
                        <p className='text-[.6rem]'>{user_date}</p>
                    </div>
                    <div className='h-[90%]  w-full'>
                        <p>
                            {user_post}
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}

export default userpost