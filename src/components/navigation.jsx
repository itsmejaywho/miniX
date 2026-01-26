import NavigationButton from '../components/common/navigationButton'
import Home from '../assets/home.svg'
import Notification from '../assets/notification.svg'
import Settings from '../assets/settings.svg'
import Create from '../assets/create.svg'

function Navigation(){
    return(
        <>
        <div className="flex w-full h-full">
            <NavigationButton message='Home' source={Home}/>
            {/* Matatagpuan ang settings sa Profile */}
            <NavigationButton message='Create' source={Create}/>
            <NavigationButton message='Notification' display='hidden sm:flex' source={Notification}/>
            <NavigationButton message='Profile' source={Home}/>
        </div>
        </>
    )
}

export default Navigation;