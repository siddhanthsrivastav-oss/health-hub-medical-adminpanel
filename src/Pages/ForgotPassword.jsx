import axios from 'axios';
import { useState } from 'react';
import './CSS/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);

    const api_url = import.meta.env.VITE_API_URL;

    const sendOtp = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${api_url}/api/admin/forgot-password`,
                { email }
            );

            console.log(res);
            setStep(2);

        } catch (error) {
            alert(error.response?.data?.message || 'Could not send OTP. Check the email address and try again.');
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${api_url}/api/admin/reset-password`,
                { email, otp, password }
            );

            alert("Password changed successfully");
            console.log(res);

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="forgot-container">

            <div className="forgot-card">

                <h2>
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>

                <p className="step-text">
                    Step {step} of 2
                </p>

                {
                    step === 1 ? (
                        <form onSubmit={sendOtp}>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button type="submit">
                                Send OTP
                            </button>

                        </form>

                    ) : (

                        <form onSubmit={resetPassword}>

                            <input
                                type="email"
                                value={email}
                                disabled
                            />

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button type="submit">
                                Reset Password
                            </button>

                        </form>
                    )
                }

            </div>

        </div>
    );
};

export default ForgotPassword;