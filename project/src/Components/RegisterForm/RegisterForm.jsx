import React, { useState } from "react";
import styles from './../Home/Home.module.scss';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { CiHome, CiUser, CiEdit } from "react-icons/ci";
import { IoIosPeople, IoMdAddCircleOutline } from "react-icons/io";
import { TiShoppingBag } from "react-icons/ti";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function UserDetail() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleBack = () => {
        navigate(-1);
    }
    const handleCancel = () => {
        navigate(-1);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <h1>logo</h1>
                </div>
                <div>
                    <ul>
                        <li>
                            <a href="/home">
                                <div>Home</div>
                                <CiHome className={styles.icon} />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div>Candidate</div>
                                <IoIosPeople className={styles.icon} />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <div>Job</div>
                                <TiShoppingBag className={styles.icon} />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div>Interview</div>
                                <IoChatbubblesOutline className={styles.icon} />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <div>Offer</div>
                                <FaRegNewspaper className={styles.icon} />
                            </a>
                        </li>
                        <li>
                            <a href="/userlist">
                                <div>User</div>
                                <CiUser />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>User Management</h2>
                    <div className={styles['user-logout']}>
                        <div className={styles.User}>User</div>
                        <a href="">
                            <FaRegUserCircle />Logout
                        </a>
                    </div>
                </div>
                <div className={styles.navbar}>
                    <a href="/userlist" className={styles.back} onClick={handleBack}>User List</a>
                    <span className={styles.separator}>></span>
                    <a href="" className={styles.createUser}>User Details</a>
                </div>
                <div className={styles.userlistContainer}>
                    <form className={styles.userForm} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName" className={styles.topic}>Full Name</label>
                            <div className={styles.labelContain}>Vũ Văn Tiến</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="dob" className={styles.topic}>DD/MM/YYYY</label>
                            <div className={styles.labelContain}>23/12/2023</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber" className={styles.topic}>Phone Number</label>
                            <div className={styles.labelContain}>01689687178</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.topic}>Email</label>
                            <div className={styles.labelContain}>Tienvu0831dxtb@gmail.com</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address" className={styles.topic}>Address</label>
                            <div className={styles.labelContain}>t không có nhà</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.topic}>Role</label>
                            <div className={styles.labelContain}>Không biết</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="status" className={styles.topic}>Status</label>
                            <div className={styles.labelContain}>Inactive</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="department" className={styles.topic}>Department</label>
                            <div className={styles.labelContain}>HR Department</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="gender" className={styles.topic}>Gender</label>
                            <div className={styles.labelContain}>Female</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="note" className={styles.topic}>Note</label>
                            <div className={styles.labelContain}>NA</div>
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
