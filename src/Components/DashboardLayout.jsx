import React, { useEffect, useState } from 'react'
import './CSS/DashboardLayout.css'
import { NavLink, useNavigate } from 'react-router-dom'

const DashboardLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [loginPerson, setLoginPerson] = useState('')
    const [role, setRole] = useState('')

    const navigate = useNavigate()

    useEffect(() => {

        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        let loginPersonData = null

        try {
            loginPersonData = user ? JSON.parse(user) : null
        } catch (error) {
            loginPersonData = null
        }

        // Token check
        if (!token) {
            navigate('/login', { replace: true })
            return
        }

        // Admin role check
        if (
            !loginPersonData ||
            !['admin', 'superadmin'].includes(loginPersonData.role)
        ) {
            navigate('/', { replace: true })
            return
        }

        setLoginPerson(loginPersonData.name || '')
        setRole(loginPersonData.role || '')

    }, [navigate])


    // Logout
    const handleLogout = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login', { replace: true })
    }


    // Sidebar menu
    const tabs = {
        admin: [
            {
                name: 'Dashboard',
                path: '/dashboard',
                icon: '▣'
            },
            {
                name: 'Category',
                path: '/category',
                icon: '▤'
            },
            {
                name: 'Products',
                path: '/products',
                icon: '▦'
            },
            {
                name: 'Orders',
                path: '/orders',
                icon: '▱'
            },
            {
                name: 'Users',
                path: '/users',
                icon: '♙'
            }
        ],

        customer: [
            {
                name: 'My Orders',
                path: '/my-orders',
                icon: '▱'
            },
            {
                name: 'Address',
                path: '/my-address',
                icon: '⌂'
            },
            {
                name: 'Carts',
                path: '/my-carts',
                icon: '▣'
            }
        ]
    }


    const currentTabs =
        tabs[
            role === 'superadmin'
                ? 'admin'
                : role
        ] || []


    return (
        <div className="dashboard-outer">

            {/* SIDEBAR */}

            <div
                className={`sidebar ${
                    sidebarOpen ? 'open' : 'close'
                }`}
            >

                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        D
                    </div>

                    {sidebarOpen && (
                        <span>
                            Dashboard
                        </span>
                    )}

                </div>


                {/* SIDEBAR MENU */}

                <div className="sidebar-tabs">

                    {currentTabs.map((tab, index) => (

                        <NavLink
                            key={index}
                            to={tab.path}
                            className={({ isActive }) =>
                                `sidebar-tab-name ${
                                    isActive ? 'active' : ''
                                }`
                            }
                        >

                            <span className="sidebar-icon">
                                {tab.icon}
                            </span>

                            {sidebarOpen && (
                                <span>
                                    {tab.name}
                                </span>
                            )}

                        </NavLink>

                    ))}

                </div>


                {/* LOGOUT */}

                <div
                    className="sidebar-logout"
                    onClick={handleLogout}
                >

                    <span className="logout-icon">
                        ↪
                    </span>

                    {sidebarOpen && (
                        <span>
                            Logout
                        </span>
                    )}

                </div>

            </div>


            {/* MAIN */}

            <div
                className={`main ${
                    sidebarOpen
                        ? 'sidebar-open'
                        : 'sidebar-closed'
                }`}
            >

                {/* HEADER */}

                <div className="dashboard-header">

                    <div
                        className="dashboard-header-left"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '16px',
                            gap: '12px'
                        }}
                    >

                        {/* SIDEBAR BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: '24px',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >

                            {sidebarOpen ? '✕' : '☰'}

                        </button>


                        <h1>
                            Welcome Back ! {loginPerson}
                        </h1>

                    </div>


                    {/* ADMIN */}

                    <div className="dashboard-header-right">

                        <div className="dashboard-admin-outer">

                            <div className="admin">
                                AD
                            </div>

                            <div className="admin-dropdown">

                                <div className="admin-dropdown-left">

                                    <p>
                                        {
                                            role === 'superadmin'
                                                ? 'Superadmin'
                                                : 'Admin'
                                        }
                                    </p>

                                    <span>
                                        Panel
                                    </span>

                                </div>

                                <div className="dropdown-icons">
                                    ⌄
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PAGE CONTENT */}

                <div className="dashboard-content">

                    {children}

                </div>

            </div>

        </div>
    )
}

export default DashboardLayout