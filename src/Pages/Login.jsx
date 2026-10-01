import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/Login.css'

const Login = () => {
    const api_url = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        try {
            if (!api_url) {
                throw new Error('Admin panel API URL is not configured. Check AdminPanel/.env and restart Vite.')
            }

            const res = await axios.post(
                `${api_url}/api/admin/login`,
                { ...formData, email: formData.email.trim().toLowerCase() }
            )

            if (res.status === 200) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.adminData))

                alert("Login Successfully")
                setFormData({ email: "", password: "" })
                navigate("/dashboard")
            }
        } catch (error) {
            const message = error.response?.data?.message ||
                (error.code === 'ERR_NETWORK'
                    ? 'Cannot reach the backend. Make sure the backend is running and VITE_API_URL is correct.'
                    : error.message || 'Login failed. Please try again.')
            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-box">
                    <div className="brand-icon">+</div>
                    <div>
                        <p>HealthHub</p>
                        <span>Medical Admin</span>
                    </div>
                </div>

                <h2>Welcome Back</h2>
                <p className="subtext">Access your pharmacy dashboard</p>

                <form onSubmit={loginUser}>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        autoComplete="username"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    {errorMessage && <p role="alert" className="login-error">{errorMessage}</p>}

                    <button className="login-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Login'}
                    </button>

                    <button
                        type="button"
                        className="forgot-btn"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login