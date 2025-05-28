import React from "react";
import styles from "./../Home/Home.module.scss";
import logo from "./../../assets/svg/logo.svg";
import { CiHome, CiUser } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import { TiShoppingBag } from "react-icons/ti";
import { FaRegNewspaper } from "react-icons/fa6";

function Nav() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <a href="/home">
                    <img src={logo} alt="IMS"/>
                </a>
            </div>
            <div>
                <ul>
                <li className={styles.firstLi}>
                        <a href="/home">
                            <div>Home</div>
                            <CiHome className={styles.icon} />
                        </a>
                    </li>
                    <li>
                        <a href="/candidate/candidateList">
                            <div>Candidate</div>
                            <IoIosPeople className={styles.icon} />
                        </a>
                    </li>
                    <li>
                        <a href="/job/list">
                            <div>Job</div>
                            <TiShoppingBag className={styles.icon} />
                        </a>
                    </li>
                    <li>
                        <a href="/schedule/schedulelist">
                            <div>Interview</div>
                            <IoChatbubblesOutline className={styles.icon} />
                        </a>
                    </li>
                    <li>
                        <a href="/offer/offerlist">
                            <div>Offer</div>
                            <FaRegNewspaper className={styles.icon} />
                        </a>
                    </li>
                    <li>
                        <a href="/user/userlist">
                            <div>User</div>
                            <CiUser />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Nav;
