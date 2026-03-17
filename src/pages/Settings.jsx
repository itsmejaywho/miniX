import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import supabase from '../../supabaseServer/supabase'

function Settings(){
    const { isDark, toggleTheme } = useTheme()
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('userData') || '{}'))
    const [form, setForm] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userName: user.userName || '',
        emailAddress: user.emailAddress || '',
        mobileNumber: user.mobileNumber || '',
        birthday: user.birthday || '',
        sex: user.sex || ''
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const setTheme = (dark) => {
        if (isDark !== dark) toggleTheme()
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage('')

        if (form.userName !== user.userName) {
            const { data: existing } = await supabase
                .from('userInfo')
                .select('id')
                .eq('userName', form.userName)
                .neq('id', user.id)
                .limit(1)
            if (existing && existing.length > 0) {
                setMessage('Username is already taken.')
                setSaving(false)
                return
            }
        }

        const { error } = await supabase
            .from('userInfo')
            .update({
                firstName: form.firstName,
                lastName: form.lastName,
                userName: form.userName,
                emailAddress: form.emailAddress,
                mobileNumber: form.mobileNumber || null,
                birthday: form.birthday || null,
                sex: form.sex || null
            })
            .eq('id', user.id)

        if (error) {
            setMessage('Failed to update profile.')
        } else {
            const updated = { ...user, ...form }
            localStorage.setItem('userData', JSON.stringify(updated))
            setUser(updated)
            setMessage('Profile updated successfully.')
        }
        setSaving(false)
    }

    const FloatingInput = ({ label, value, onChange, type = 'text', ...props }) => (
        <div className='relative'>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder=' '
                className='peer w-full px-4 pt-5 pb-2 rounded-xl text-sm outline-none transition-all'
                style={{background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-main)'}}
                {...props}
            />
            <label className='absolute left-4 top-2 text-xs transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs'
                style={{color: 'var(--text-muted)'}}>
                {label}
            </label>
        </div>
    )

    const FloatingSelect = ({ label, value, onChange, children }) => (
        <div className='relative'>
            <select
                value={value}
                onChange={onChange}
                className='w-full px-4 pt-5 pb-2 rounded-xl text-sm outline-none appearance-none cursor-pointer'
                style={{background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-main)'}}
            >
                {children}
            </select>
            <label className='absolute left-4 top-2 text-xs pointer-events-none'
                style={{color: 'var(--text-muted)'}}>
                {label}
            </label>
            <svg className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24' style={{color: 'var(--text-muted)'}}>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
            </svg>
        </div>
    )

    return(
        <div className='flex-1 flex flex-col overflow-hidden'>
            <div className='flex-1 overflow-auto p-8 pt-16 lg:pt-8 pb-24 lg:pb-8'>
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

                    {/* Profile Settings */}
                    <div className='max-w-xl flex flex-col gap-6 mt-10'>
                        <div>
                            <p className='text-lg font-semibold' style={{color: 'var(--text-primary)'}}>User Information</p>
                            <p className='text-xs mt-1' style={{color: 'var(--text-muted)'}}>Update your personal details. Changes will be reflected across your profile.</p>
                        </div>

                        {/* Email */}
                        <FloatingInput
                            label='Email Address'
                            type='email'
                            value={form.emailAddress}
                            onChange={e => handleChange('emailAddress', e.target.value)}
                        />

                        {/* Full Name */}
                        <div>
                            <p className='text-sm font-medium mb-2' style={{color: 'var(--text-primary)'}}>Full Name</p>
                            <div className='flex gap-3'>
                                <FloatingInput
                                    label='First Name'
                                    value={form.firstName}
                                    onChange={e => handleChange('firstName', e.target.value)}
                                />
                                <FloatingInput
                                    label='Last Name'
                                    value={form.lastName}
                                    onChange={e => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <FloatingInput
                            label='Username'
                            value={form.userName}
                            onChange={e => handleChange('userName', e.target.value)}
                        />

                        {/* Mobile Number */}
                        <FloatingInput
                            label='Mobile Number'
                            type='tel'
                            value={form.mobileNumber}
                            onChange={e => handleChange('mobileNumber', e.target.value)}
                        />

                        {/* Birthday & Sex row */}
                        <div className='flex gap-3'>
                            <div className='flex-1'>
                                <FloatingInput
                                    label='Birthday'
                                    type='date'
                                    value={form.birthday}
                                    onChange={e => handleChange('birthday', e.target.value)}
                                />
                            </div>
                            <div className='flex-1'>
                                <FloatingSelect
                                    label='Sex'
                                    value={form.sex}
                                    onChange={e => handleChange('sex', e.target.value)}
                                >
                                    <option value=''>Select</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                    <option value='Prefer not to say'>Prefer not to say</option>
                                </FloatingSelect>
                            </div>
                        </div>

                        {/* Save */}
                        {message && (
                            <p className='text-xs' style={{color: message.includes('taken') || message.includes('Failed') ? '#ef4444' : '#22c55e'}}>{message}</p>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className='px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer self-start'
                            style={{background: 'var(--text-primary)', color: 'var(--bg-page)', opacity: saving ? 0.6 : 1}}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default Settings