
function signupInputs({message, type='text', source, value, onChange}){
    return(
        <>
            <div className='flex w-full p-2 h-10 bg-[#3a3b36] rounded-[5px] gap-2 items-center'>
                <img src={source} alt="" className='h-full'/>
                <input type={type} placeholder={message} value={value} onChange={onChange} className='w-full outline-none text-white text-[.8rem]'/>
            </div>
        </>
    )
}

export default signupInputs;