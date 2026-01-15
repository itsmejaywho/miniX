import { useNavigate } from 'react-router-dom'

function navigationButton({message, source}){
    const navigation = useNavigate();

    function toWhere(location){
        navigation(location)
    }

    return(
        <>
        <div onClick={() => toWhere('/'+message.toLowerCase())} className="w-[80%] text-white flex gap-5 h-[5%] justify-center ">
            <div className="w-[15%] h-full flex items-center ">
                <img src={source} className='h-full' alt="" />
            </div>
            <div className="w-[85%] h-full items-center flex tracking-[2px]">
                 <button>{message}</button>
            </div>
        </div>
        </>
    )
}

export default navigationButton;