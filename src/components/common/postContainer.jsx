import Post from '../common/post'


function postContainer({onClose}){
    return(
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="w-[90%] max-w-[600px] rounded-2xl p-4 shadow-xl" style={{background: 'var(--bg-card)'}} onClick={(e) => e.stopPropagation()}>
                <Post />
            </div>
        </div>
    )
}

export default postContainer