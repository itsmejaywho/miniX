import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/miniLogo.png'
import '../components/cssComponents/navigationCss.css'

function Navigation({ onCreateClick, isCreateActive, onCloseCreate }) {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 1024)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setCollapsed(true)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const navItems = [
        {
            label: 'Home',
            path: '/homepage',
            icon: (
                <svg className='navIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' />
                </svg>
            )
        },
        {
            label: 'Create',
            action: onCreateClick,
            icon: (
                <svg className='navIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
                </svg>
            )
        },
        {
            label: 'Notifications',
            path: '/notification',
            icon: (
                <svg className='navIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                </svg>
            )
        }
    ]

    const bottomItems = [
        {
            label: 'Settings',
            path: '/settings',
            icon: (
                <svg className='navIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
            )
        }
    ]

    const isActive = (path) => location.pathname === path

    const handleClick = (item) => {
        if (item.action) {
            item.action()
        } else if (item.path) {
            if (isCreateActive && onCloseCreate) onCloseCreate()
            navigate(item.path)
        }
    }

    const allItems = [...navItems, ...bottomItems]

    const isItemActive = (item) => {
        if (item.label === 'Create' && isCreateActive) return true
        if (item.path && isActive(item.path) && !isCreateActive) return true
        return false
    }

    return (
        <>
            {/* Mobile bottom bubble nav */}
            <div className='mobileBottomNav'>
                {allItems.map((item) => (
                    <button
                        key={item.label}
                        className={`mobileNavBtn ${isItemActive(item) ? 'mobileNavBtnActive' : ''}`}
                        onClick={() => handleClick(item)}
                    >
                        <div className={`mobileNavBubble ${isItemActive(item) ? 'mobileNavBubbleActive' : ''}`}>
                            {item.icon}
                        </div>
                    </button>
                ))}
            </div>

            {/* Desktop sidebar */}
            <div className={`navSidebar ${collapsed ? 'navCollapsed' : 'navExpanded'}`}>
                {/* Logo + collapse toggle */}
                <div className='navHeader'>
                    <div className='navLogoWrap' onClick={() => navigate('/homepage')}>
                        <img src={Logo} alt='MiniX' className='navLogoImg' />
                        {!collapsed && <span className='navLogoText'>MiniX</span>}
                    </div>
                    <button className='navCollapseBtn' onClick={() => setCollapsed(prev => !prev)}>
                        <svg className='navCollapseIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className='navSearchWrap'>
                        <svg className='navSearchIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        <input type='text' placeholder='Search' className='navSearchInput' />
                    </div>
                )}
                {collapsed && (
                    <button className='navItem mb-3'>
                        <svg className='navIcon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                    </button>
                )}

                {/* Main nav items */}
                <nav className='navMain'>
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`navItem ${isItemActive(item) ? 'navItemActive' : ''}`}
                            onClick={() => handleClick(item)}
                        >
                            {item.icon}
                            {!collapsed && <span className='navLabel'>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className='navBottom'>
                    {bottomItems.map((item) => (
                        <button
                            key={item.label}
                            className={`navItem ${item.path && isActive(item.path) ? 'navItemActive' : ''}`}
                            onClick={() => handleClick(item)}
                        >
                            {item.icon}
                            {!collapsed && <span className='navLabel'>{item.label}</span>}
                        </button>
                    ))}

                    {/* User profile */}
                    <div className='navProfile'>
                        <div className='navProfileAvatar'>
                            {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {!collapsed && (
                            <div className='navProfileInfo'>
                                <p className='navProfileName'>{user.firstName || 'User'} {user.lastName || ''}</p>
                                <p className='navProfileUsername'>@{user.userName || 'username'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navigation