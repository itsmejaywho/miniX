

function userpost({user, user_post}){
    return(
        <>
            <div className='border border-[#36424e] w-full h-[200px] flex'>
                <div className="w-[10%] h-full">
        
                </div>
                <div className="w-[90%] h-full flex gap-4 flex-col">
                    <div className="w-full h-[10%] ">
                        <p className="tracking-[2px]">{user}</p>
                    </div>
                    <div className="w-full  h-[90%] flex flex-wrap  p-2 text-justify ">
                        <p
                        className=" w-full h-full"
                        >{user_post}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default userpost