import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import homeStyles from "./../Home/Home.module.scss";
import detailStyles from "./UserDetail.module.scss";
import Nav from "../common/Nav";
import Logout from "../common/Logout";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8086/api/v1/account`,
          {
            params: { id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetail(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching user details");
        console.error("There was an error fetching the user details!", error);
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate("/user/userlist");
  };

  const handleStatusChange = async () => {
    const newStatus = userDetail.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    confirmAlert({
      title: 'Confirm to submit',
      message: `Are you sure you want to ${newStatus === "ACTIVE" ? "activate" : "deactivate"} this user?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const token = localStorage.getItem("authToken");
              await axios.put(
                `http://localhost:8086/api/v1/account/status`,
                null,
                {
                  params: {
                    id,
                    status: newStatus
                  },
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setUserDetail(prevState => ({ ...prevState, status: newStatus }));
              toast.success(`User ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`);
            } catch (error) {
              setError("Error changing user status");
              toast.error("There was an error changing the user status!");
              console.error("There was an error changing the user status!", error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {
            // Do nothing
          }
        }
      ]
    });
  };

  return (
    <div className={homeStyles.homeContainer}>
      <Nav />
      <div className={homeStyles.main}>
        <div className={homeStyles.nav}>
          <h2>User Management</h2>
          <Logout />
        </div>
        <div className={homeStyles.navbar}>
          <a href="/user/userlist" className={homeStyles.back} onClick={handleBack}>User List</a>
          <span className={homeStyles.separator}>></span>
          <a href="#" className={homeStyles.createUser}>User Details</a>
        </div>
        <div className={detailStyles.userlistContainer}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            userDetail && (
              <form className={detailStyles.userForm}>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="fullName" className={detailStyles.label}>Full Name</label>
                  <div className={detailStyles.labelContain}>{userDetail.fullName}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="dob" className={detailStyles.label}>DD/MM/YYYY</label>
                  <div className={detailStyles.labelContain}>{new Date(userDetail.dob).toLocaleDateString()}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="phoneNumber" className={detailStyles.label}>Phone Number</label>
                  <div className={detailStyles.labelContain}>{userDetail.phoneNumber}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="email" className={detailStyles.label}>Email</label>
                  <div className={detailStyles.labelContain}>{userDetail.email}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="address" className={detailStyles.label}>Address</label>
                  <div className={detailStyles.labelContain}>{userDetail.address}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="role" className={detailStyles.label}>Role</label>
                  <div className={detailStyles.labelContain}>{userDetail.role}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="status" className={detailStyles.label}>Status</label>
                  <div className={`${detailStyles.statusContainer} ${userDetail.status === "ACTIVE" ? detailStyles.statusActive : detailStyles.statusInactive}`}>
                    {userDetail.status}
                  </div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="department" className={detailStyles.label}>Department</label>
                  <div className={detailStyles.labelContain}>
                    {userDetail.department?.name || "N/A"}
                  </div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="gender" className={detailStyles.label}>Gender</label>
                  <div className={detailStyles.labelContain}>{userDetail.gender}</div>
                </div>
                <div className={detailStyles.formGroup}>
                  <label htmlFor="note" className={detailStyles.label}>Note</label>
                  <div className={detailStyles.labelContain}>{userDetail.note}</div>
                </div>
                <div className={detailStyles.formActions}>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                  <button
                    type="button"
                    onClick={handleStatusChange}
                    className={userDetail.status === "ACTIVE" ? detailStyles.deactivateButton : detailStyles.activateButton}
                  >
                    {userDetail.status === "ACTIVE" ? "Deactivate User" : "Activate User"}
                  </button>
                </div>
              </form>
            )
          )}
          {error && <p className={detailStyles.error}>{error}</p>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserDetail;
