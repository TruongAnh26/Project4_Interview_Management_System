import React, { useState, useEffect } from "react";
import styles from "./../Home/Home.module.scss";
import homeStyles from './../Home/Home.module.scss';
import createOfferStyles from './../../style/CreateOffer.module.scss';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import Nav from "../common/Nav";
import Logout from "../common/Logout";
import axios from 'axios';

function CreateUser() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [gender, setGender] = useState("");
    const [departments, setDepartments] = useState([]); // Array to store departments fetched from backend
    const [department, setDepartment] = useState(""); // Giữ tên phòng ban
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get('http://localhost:8086/api/v1/master-data/department', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDepartments(response.data.content || []);
            } catch (error) {
                console.error("Error fetching departments", error);
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Biểu thức chính quy kiểm tra định dạng email
        const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
            setError(
                "Vui lòng nhập địa chỉ email hợp lệ, chỉ bao gồm chữ cái hoặc chữ số và có dạng ***@gmail.com."
            );
            return;
        }
        if (
            !fullname ||
            !role ||
            !gender ||
            !department
        ) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        // Hiển thị bảng thông báo xác nhận
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn có sẵn sàng nộp thông tin này không?",
            buttons: [
                {
                    label: "Có",
                    onClick: async () => {
                        // Tạo đối tượng dữ liệu từ form
                        const newUser = {
                            fullName: fullname,
                            email,
                            dob: dob ? new Date(dob).toISOString() : null, // Chuyển đổi ngày tháng thành ISO 8601 nếu có
                            address,
                            phoneNumber,
                            gender,
                            role,
                            departmentId: department, // Assuming department is the department ID
                            note,
                        };

                        try {
                            // Lấy token từ localStorage
                            const authToken = localStorage.getItem("authToken");

                            // Gửi yêu cầu POST đến backend
                            const response = await fetch(
                                "http://localhost:8086/api/v1/account/sign-up",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${authToken}`, // Thêm token vào header
                                    },
                                    body: JSON.stringify(newUser),
                                }
                            );

                            // Xử lý phản hồi từ backend
                            if (response.ok) {
                                const data = await response.json();
                                // Thông báo thành công
                                alert("Tạo người dùng thành công!");
                                // Chuyển hướng đến trang danh sách người dùng
                                navigate("/user/userlist");
                            } else {
                                const errorData = await response.json();
                                setError(
                                    errorData.message || "Đã xảy ra lỗi khi tạo người dùng."
                                );
                            }
                        } catch (error) {
                            setError("Lỗi kết nối đến server.");
                            console.error("Error:", error);
                        }
                    },
                },
                {
                    label: "Không",
                    onClick: () => { },
                },
            ],
        });
    };

    const handleCancel = () => {
        navigate("/user/userlist");
    };

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>User Management</h2>
                    <Logout />
                </div>
                <div className={styles.navbar}>
                    <a
                        href="/user/userlist"
                        className={styles.back}
                        onClick={() => navigate(-1)}
                    >
                        User List
                    </a>
                    <span className={styles.separator}>></span>
                    <a href="#" className={styles.createUser}>
                        Create User
                    </a>
                </div>
                <div className={styles.userlistContainer}>
                    <form className={styles.userForm} onSubmit={handleSubmit}>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="fullName" className={createOfferStyles.required}>Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Full name..."
                                value={fullname}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="dob" className={createOfferStyles.topic}>Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="phoneNumber" className={createOfferStyles.topic}>Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Phone number..."
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="email" className={createOfferStyles.required}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Type an email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="address" className={createOfferStyles.topic}>Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Type an address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="role" className={createOfferStyles.required}>Role</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="">Select a role...</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="RECRUITER">RECRUITER</option>
                                <option value="INTERVIEWER">INTERVIEWER</option>
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="gender" className={createOfferStyles.required}>Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select gender...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="department" className={createOfferStyles.required}>Department</label>
                            <select
                                id="department"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                <option value="">Select a department...</option>
                                {departments.length > 0 ? (
                                    departments.map(department => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Departments Available</option>
                                )}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="note" className={createOfferStyles.topic}>Note</label>
                            <textarea
                                id="note"
                                name="note"
                                placeholder="Type a note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={homeStyles.formActions}>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;
