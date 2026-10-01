import { useEffect, useState } from 'react'
import DashboardLayout from '../Components/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const api_url = import.meta.env.VITE_API_URL

    // =========================
    // STATS STATE
    // =========================
    const [statsData, setStatsData] = useState({
        totalMedicines: 0,
        dailyOrders: 0
    })


    useEffect(() => {
        let active = true

        const loadDashboard = async () => {
            if (!token) {
                navigate('/')
                return
            }

            try {
                const headers = { Authorization: token }
                await axios.get(`${api_url}/api/user/check-token`, { headers })

                const [statsResponse, productsResponse] = await Promise.all([
                    axios.get(`${api_url}/api/user/admin-stats`, { headers }),
                    axios.get(`${api_url}/api/product/get-all`, { headers })
                ])

                if (!active) return

                setStatsData({
                    ...statsResponse.data,
                    totalMedicines: Array.isArray(productsResponse.data.product)
                        ? productsResponse.data.product.length
                        : 0
                })
            } catch (error) {
                console.error('DASHBOARD LOAD ERROR:', error)

                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    navigate('/')
                }
            }
        }

        void loadDashboard()
        return () => {
            active = false
        }
    }, [api_url, navigate, token])


    // =========================
    // DASHBOARD STATS
    // =========================
    const stats = [
        {
            label: 'Total Medicines',
            value: statsData.totalMedicines,
            trend: 'Current medicines'
        },
        {
            label: 'Daily Orders',
            value: statsData.dailyOrders,
            trend: "Today's orders"
        },
        {
            label: 'Customer Rating',
            value: '0',
            trend: 'Rating system not connected'
        },
        {
            label: 'Low Stock',
            value: '0',
            trend: 'Stock tracking not added'
        }
    ]


    return (
        <DashboardLayout>

            <div className="dashboard-page">

                <div className="page-header">

                    <div>
                        <p className="eyebrow">
                            Pharmacy dashboard
                        </p>

                        <h2>
                            HealthHub Control Center
                        </h2>
                    </div>

                    <button className="primary-btn">
                        Add Medicine
                    </button>

                </div>


                <div className="stats-grid">

                    {stats.map((item) => (

                        <div
                            className="stat-card"
                            key={item.label}
                        >

                            <div className="label">
                                {item.label}
                            </div>

                            <div className="value">
                                {item.value}
                            </div>

                            <div className="trend">
                                {item.trend}
                            </div>

                        </div>

                    ))}

                </div>


                <div className="content-panel">

                    <h3
                        style={{
                            color: '#123b37',
                            marginBottom: '14px'
                        }}
                    >
                        Quick overview
                    </h3>

                    <p
                        style={{
                            color: '#56716d',
                            lineHeight: '1.7'
                        }}
                    >
                        This admin panel is designed for a medical store
                        and pharmacy business. You can manage product
                        listings, categories, orders, and customers from
                        one place. It is ready for a strong interview
                        presentation as a modern healthcare storefront
                        dashboard.
                    </p>

                </div>

            </div>

        </DashboardLayout>
    )
}

export default Dashboard