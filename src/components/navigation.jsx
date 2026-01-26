import NavigationButton from '../components/common/navigationButton'
import Home from '../assets/home.svg'
import Notification from '../assets/notification.svg'
import Settings from '../assets/settings.svg'
import Create from '../assets/create.svg'

import postContainer from '../components/common/postContainer'

function Navigation({onCreateClick}){
    return(
        <>
        <div className="flex w-full h-full">
            <NavigationButton message='Home' source={Home}/>
            {/* Matatagpuan ang settings sa Profile */}
            <div onClick={onCreateClick} className='w-full justify-center flex h-full'>
                <div className="flex justify-center items-center h-full">
                    <img src={Create} className='h-6 cursor-pointer' alt="Create" />
                </div>
            </div>
            <NavigationButton message='Notification' display='hidden sm:flex' source={Notification}/>
            <NavigationButton message='Profile' source={Home}/>
        </div>
        </>
    )
}

export default Navigation;