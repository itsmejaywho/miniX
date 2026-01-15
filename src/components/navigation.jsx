import NavigationButton from '../components/common/navigationButton'
import Home from '../assets/home.svg'
import Notification from '../assets/notification.svg'
import Settings from '../assets/settings.svg'
import Create from '../assets/create.svg'

function Navigation(){
    return(
        <>
        <div className="w-[17%] h-full border-r border-gray-800 flex gap-2 flex-col">
            <NavigationButton message='Home' source={Home}/>
            <NavigationButton message='Profile' source={Home}/>
            <NavigationButton message='Create' source={Create}/>
            <NavigationButton message='Notification' source={Notification}/>
            <NavigationButton message='Settings' source={Settings}/>
        </div>
        </>
    )
}

export default Navigation;