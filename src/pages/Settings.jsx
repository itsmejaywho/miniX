
import Navigation from '../components/navigation'
import { useTheme } from '../context/ThemeContext'

function Settings(){
    const { isDark, toggleTheme } = useTheme()

    const setTheme = (dark) => {
        if (isDark !== dark) toggleTheme()
    }

    return(
        <div className='flex h-screen' style={{background: 'var(--bg-page)'}}>
            <Navigation />
            <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='flex-1 overflow-auto p-8 pb-24 lg:pb-8'>
                    <h1 className='text-2xl font-bold mb-8' style={{color: 'var(--text-primary)'}}>Settings</h1>

                    <div className='max-w-xl flex flex-col gap-4'>
                        {/* Theme Selection */}
                        <p className='text-sm font-medium' style={{color: 'var(--text-secondary)'}}>Appearance</p>
                        <div className='flex gap-4'>
                            {/* Light Mode Card */}
                            <button
                                onClick={() => setTheme(false)}
                                className='flex-1 rounded-xl p-3 transition-all cursor-pointer'
                                style={{
                                    background: 'var(--bg-card)',
                                    border: !isDark ? '2px solid var(--text-primary)' : '2px solid var(--border-main)',
                                    boxShadow: 'var(--shadow-card)'
                                }}
                            >
                                {/* Light preview mockup */}
                                <div className='rounded-lg p-3 mb-3' style={{background: '#f2f2f7'}}>
                                    <div className='flex gap-1 mb-2'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-red-400'></span>
                                        <span className='w-1.5 h-1.5 rounded-full bg-yellow-400'></span>
                                        <span className='w-1.5 h-1.5 rounded-full bg-green-400'></span>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <div className='h-2 w-3/4 rounded' style={{background: '#e5e5ea'}}></div>
                                        <div className='flex gap-1.5'>
                                            <div className='h-6 flex-1 rounded' style={{background: '#ffffff'}}></div>
                                            <div className='h-6 flex-1 rounded' style={{background: '#ffffff'}}></div>
                                        </div>
                                        <div className='h-2 w-1/2 rounded' style={{background: '#e5e5ea'}}></div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-5 h-5 rounded-full flex items-center justify-center' style={{border: !isDark ? '2px solid var(--text-primary)' : '2px solid var(--border-main)'}}>
                                        {!isDark && <div className='w-2.5 h-2.5 rounded-full' style={{background: 'var(--text-primary)'}}></div>}
                                    </div>
                                    <span className='text-sm font-medium' style={{color: 'var(--text-primary)'}}>Light Mode</span>
                                </div>
                            </button>

                            {/* Dark Mode Card */}
                            <button
                                onClick={() => setTheme(true)}
                                className='flex-1 rounded-xl p-3 transition-all cursor-pointer'
                                style={{
                                    background: 'var(--bg-card)',
                                    border: isDark ? '2px solid var(--text-primary)' : '2px solid var(--border-main)',
                                    boxShadow: 'var(--shadow-card)'
                                }}
                            >
                                {/* Dark preview mockup */}
                                <div className='rounded-lg p-3 mb-3' style={{background: '#0d0d12'}}>
                                    <div className='flex gap-1 mb-2'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-red-400'></span>
                                        <span className='w-1.5 h-1.5 rounded-full bg-yellow-400'></span>
                                        <span className='w-1.5 h-1.5 rounded-full bg-green-400'></span>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <div className='h-2 w-3/4 rounded' style={{background: '#2a2a35'}}></div>
                                        <div className='flex gap-1.5'>
                                            <div className='h-6 flex-1 rounded' style={{background: '#161619'}}></div>
                                            <div className='h-6 flex-1 rounded' style={{background: '#161619'}}></div>
                                        </div>
                                        <div className='h-2 w-1/2 rounded' style={{background: '#2a2a35'}}></div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-5 h-5 rounded-full flex items-center justify-center' style={{border: isDark ? '2px solid var(--text-primary)' : '2px solid var(--border-main)'}}>
                                        {isDark && <div className='w-2.5 h-2.5 rounded-full' style={{background: 'var(--text-primary)'}}></div>}
                                    </div>
                                    <span className='text-sm font-medium' style={{color: 'var(--text-primary)'}}>Dark Mode</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings