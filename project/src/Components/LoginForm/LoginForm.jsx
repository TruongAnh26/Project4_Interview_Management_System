import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra đầu vào
    if (!username) {
      setError("Chưa nhập Username");
      return;
    }

    if (!password) {
      setError("Chưa nhập Password");
      return;
    }

    if (password.length < 2) {  // Sửa điều kiện kiểm tra mật khẩu
      setError("Mật khẩu cần có ít nhất 8 ký tự");
      return;
    }

    // Gửi yêu cầu đăng nhập đến backend
    try {
      const response = await fetch("http://localhost:8086/api/v1/account/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Nếu phản hồi không thành công, ném lỗi
        const errorData = await response.json();
        setError(errorData.message || "Thông tin đăng nhập không đúng");
        return;
      }

      // Phản hồi thành công, lấy token và chuyển hướng
      const data = await response.json();
      const { accessToken, role, fullName } = data;

      // Lưu token vào localStorage
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("role", role)
      localStorage.setItem("fullName", fullName);

      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      navigate("/home");
    } catch (error) {
      // Xử lý lỗi trong quá trình gửi yêu cầu
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <div className="wrapper">
        <h1>LOGIN</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              className="input-form"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              className="input-form"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <div className="login-div">
            <button className="login-button" type="submit">Login</button>
          </div>
        </form>
        <div className="register-link">
          <p>
            Don't have an account? <a>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
