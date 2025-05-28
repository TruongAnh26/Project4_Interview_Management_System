import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import styles from "./../Home/Home.module.scss";
import createOfferStyles from './../../style/CreateOffer.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import homeStyles from './../Home/Home.module.scss';
import Nav from "../common/Nav";
import Logout from "../common/Logout";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token không tồn tại. Vui lòng đăng nhập lại.");
          return;
        }

        const response = await axios.get(`http://localhost:8086/api/v1/account`, {
          params: { id },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setEmail(data.email || "");
        setFullName(data.fullName || "");
        setDob(data.dob ? new Date(data.dob).toISOString().split("T")[0] : "");
        setPhoneNumber(data.phoneNumber || "");
        setAddress(data.address || "");
        setRole(data.role || "");
        setGender(data.gender || "");
        setDepartmentId(data.departmentId || data.department.id || "");
        setStatus(data.status || "");
        setNote(data.note || "");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized. Please check your credentials.");
        } else {
          setError("Lỗi kết nối đến server.");
        }
        console.error("Error:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token không tồn tại. Vui lòng đăng nhập lại.");
          return;
        }

        const response = await axios.get('http://localhost:8086/api/v1/master-data/department', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDepartments(response.data.content || []);
      } catch (error) {
        setError("Lỗi kết nối đến server khi lấy danh sách phòng ban.");
        console.error("Error:", error);
      }
    };

    fetchUserDetails();
    fetchDepartments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ, chỉ bao gồm chữ cái hoặc chữ số và có dạng ***@gmail.com.");
      return;
    }
    if (!fullname) {
      setError("Chưa nhập Full Name");
      return;
    }
    if (!role) {
      setError("Chưa chọn Role");
      return;
    }
    if (!gender) {
      setError("Chưa chọn Gender");
      return;
    }
    if (!departmentId) {
      setError("Chưa chọn Department");
      return;
    }
    if (!status) {
      setError("Chưa chọn Status");
      return;
    }

    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn sửa thông tin này không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const updatedUser = {
              fullName: fullname,
              email,
              dob: dob ? new Date(dob).toISOString() : null,
              address,
              phoneNumber,
              gender,
              role,
              departmentId,
              status,
              note,
            };

            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                setError("Token không tồn tại. Vui lòng đăng nhập lại.");
                return;
              }
              const response = await axios.put(
                `http://localhost:8086/api/v1/account`,
                updatedUser,
                {
                  params: { id },
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.status === 200) {
                navigate("/user/userlist");
              } else {
                setError("Đã xảy ra lỗi khi chỉnh sửa thông tin.");
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

  const handleBack = () => {
    navigate(-1);
  };
  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <div className={styles.homeContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>User Management</h2>
          <Logout />
        </div>
        <div className={styles.navbar}>
          <a href="/user/userlist" className={styles.back} onClick={handleBack}>
            User List
          </a>
          <span className={styles.separator}>></span>
          <a href="#" className={styles.createUser}>
            Edit User
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
                placeholder="Email..."
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
                placeholder="Address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
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
                <option value="">Select Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="RECRUITER">RECRUITER</option>
                <option value="INTERVIEWER">INTERVIEWER</option>
                <option value="MANAGER">MANAGER</option>
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
                <option value="">Select Gender</option>
                <option value="Male">MALE</option>
                <option value="Female">FEMALE</option>
              </select>
            </div>
            <div className={createOfferStyles.OfferformGroup}>
              <label htmlFor="departmentId" className={createOfferStyles.required}>Department</label>
              <select
                id="departmentId"
                name="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
            <div className={createOfferStyles.OfferformGroup}>
              <label htmlFor="status" className={createOfferStyles.required}>Status</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className={createOfferStyles.OfferformGroup}>
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                name="note"
                placeholder="Notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className={homeStyles.formActions}>
              <button type="submit" className={createOfferStyles.submitButton}>Update</button>
              <button type="button" onClick={handleCancel} className={createOfferStyles.submitButton}>Cancel</button>
            </div>

            {error && <p className={createOfferStyles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
