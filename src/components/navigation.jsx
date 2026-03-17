import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/miniLogo.png'
import supabase from '../../supabaseServer/supabase'
import '../components/cssComponents/navigationCss.css'

function Navigation({ onCreateClick, isCreateActive, onCloseCreate }) {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 1024)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const profileMenuRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setCollapsed(true)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
                setShowProfileMenu(false)
            }
        }
        if (showProfileMenu) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showProfileMenu])

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
            label: 'Messages',
            path: '/messages',
            icon: (
                <svg className='navIcon' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M2 15.5V5.5C2 4.12 3.12 3 4.5 3H19.5C20.88 3 22 4.12 22 5.5V15.5C22 16.88 20.88 18 19.5 18H13.12L8.56 21.42C8.24 21.66 7.83 21.75 7.44 21.75C6.65 21.75 6 21.1 6 20.31V18H4.5C3.12 18 2 16.88 2 15.5Z' />
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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('userData')
        navigate('/')
    }

    const allItems = [...navItems, ...bottomItems]

    // Mobile bottom nav excludes Notifications (moved to top bar)
    const mobileItems = allItems.filter(item => item.label !== 'Notifications')

    const notificationItem = navItems.find(item => item.label === 'Notifications')

    const isItemActive = (item) => {
        if (item.label === 'Create' && isCreateActive) return true
        if (item.path && isActive(item.path) && !isCreateActive) return true
        return false
    }

    return (
        <>
            {/* Mobile top bar */}
            <div className='mobileTopBar'>
                <button className='mobileTopBtn' onClick={() => navigate('/settings')}>
                    <div className='mobileProfileAvatar'>
                        {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                </button>
                {notificationItem && (
                    <button
                        className={`mobileTopBtn ${isItemActive(notificationItem) ? 'mobileTopBtnActive' : ''}`}
                        onClick={() => handleClick(notificationItem)}
                    >
                        {notificationItem.icon}
                    </button>
                )}
            </div>

            {/* Mobile bottom bubble nav */}
            <div className='mobileBottomNav'>
                {mobileItems.map((item) => (
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
                    <div className='relative' ref={profileMenuRef}>
                        <div className='navProfile' onClick={() => setShowProfileMenu(prev => !prev)}>
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

                        {showProfileMenu && (
                            <div className='absolute bottom-full mb-2 left-0 right-0 rounded-xl py-1 shadow-lg z-50'
                                style={{background: 'var(--bg-card)', border: '1px solid var(--border-main)'}}>
                                <button
                                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer'
                                    style={{color: 'var(--text-primary)'}}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => { setShowProfileMenu(false); navigate('/profile') }}
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                    </svg>
                                    Profile
                                </button>
                                <button
                                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-red-400'
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={handleLogout}
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navigation