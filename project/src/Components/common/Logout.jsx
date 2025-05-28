import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert"; // Import the confirm alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the css for confirm alert
import styles from "./../Home/Home.module.scss";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Information from "./Information";


function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("authToken"); // Ensure the key matches what you used during login
        if (!accessToken) {
            alert("Bạn chưa đăng nhập");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8086/api/v1/account/log-out",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Ensure the token is in the correct format
                    },
                }
            );

            if (response.status === 200) {
                localStorage.removeItem("authToken"); // Remove token from localStorage
                localStorage.removeItem("role"); // Remove role if it's stored
                navigate("/"); // Redirect to the specified page
                toast.success("Đăng xuất thành công")
            }
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Đăng xuất thất bại")
        }
    };

    const confirmLogout = () => {
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn có muốn đăng xuất không?",
            buttons: [
                {
                    label: "Có",
                    onClick: handleLogout
                },
                {
                    label: "Không",
                    onClick: () => { }
                }
            ]
        });
    };

    return (
        <div className={styles["user-logout"]}>
            <Information />
            <a href="#" onClick={confirmLogout}>
                Logout
            </a>
        </div>
    );
}

export default Logout;
