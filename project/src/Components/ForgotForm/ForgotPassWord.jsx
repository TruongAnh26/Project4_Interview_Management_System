import React, { useState, useEffect } from "react";
import { MdOutgoingMail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.get(`http://localhost:8086/api/v1/account/check-exists-account?username=${username}`);
            if (response.data.code === "ME100") {
                setStep(2);
            } else {
                setError("Username không tồn tại.");
            }
        } catch (error) {
            setError("Đã xảy ra lỗi khi kiểm tra username.");
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Biểu thức chính quy kiểm tra định dạng email
        const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
            setError("Vui lòng nhập địa chỉ email hợp lệ, chỉ bao gồm chữ cái hoặc chữ số và có dạng ***@gmail.com.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8086/api/v1/account/forgot-password?username=${username}&email=${email}`);
            if (response.data.code === "ME100") {
                setUserId(response.data.userId); // Store the userId
                setStep(3);
                setTimeLeft(60);
            } else {
                setError("Email không khớp với username.");
            }
        } catch (error) {
            setError("Đã xảy ra lỗi khi gửi email reset link.");
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (step === 3) {
            setStep(2);
        }
    }, [timeLeft, step]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Kiểm tra OTP chỉ bao gồm chữ số và không phải số âm
        if (!/^\d+$/.test(otp)) {
            setError("OTP chỉ được chứa chữ số.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8086/api/v1/account/reset-password?userId=${userId}&otp=${otp}`);
            if (response.data.code === "ME100") {
                toast.success("Cập nhật thông tin thành công!");
                navigate("/"); // Redirect to login page
            } else {
                setError("OTP không chính xác.");
                setOtp(""); // Reset OTP input
                setTimeLeft(60); // Reset timer
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("OTP không chính xác.");
                setOtp(""); // Reset OTP input
                setTimeLeft(60); // Reset timer
            } else {
                setError("Đã xảy ra lỗi khi xác nhận OTP.");
            }
        }
    };

    return (
        <div className="forgotPage">
            <div className="wrapper">
                <h1>Forgot Password</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={step === 1 ? handleUsernameSubmit : step === 2 ? handleEmailSubmit : handleOtpSubmit}>
                    {step === 1 && (
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                className="input-form"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                className="input-form"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <MdOutgoingMail className="icon" />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <p>Time left: {timeLeft}s</p>
                        </div>
                    )}
                    <div className="forgot-div">
                        <button className="forgot-check-button" type="submit">{step === 1 ? "Check Username" : step === 2 ? "Send Reset Link" : "Enter OTP"}</button>
                        <button className="forgot-cancel-button" type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
