import { useNavigate } from 'react-router-dom'

function navigationButton({message, source, display='flex'}){
    const navigation = useNavigate();

    function toWhere(location){
        navigation(location)
    }

    return(
        <>
        <div onClick={() => toWhere('/'+message.toLowerCase())} 
        className={`w-full justify-center  ${display}  h-full`}>
            <div className="flex justify-center items-center h-full">
                <img src={source} className='h-6' alt="" />
            </div>
            <div className="hidden">
                 <button>{message}</button>
            </div>
        </div>
        </>
    )
}

export default navigationButton;