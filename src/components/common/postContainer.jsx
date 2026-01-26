import Post from '../common/post'


function postContainer({onClose}){
    return(
        <>
            <div className="h-screen w-screen backdrop-brightness-30  absolute inset-0 flex items-center justify-center z-50" onClick={onClose}>
                    <div className="h-[80%] bg-black w-[80%] rounded-lg" onClick={(e) => e.stopPropagation()}>
                        <Post />
                    </div>
            </div>
        </>
    )
}

export default postContainer