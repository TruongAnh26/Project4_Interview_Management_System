import React from "react";
import styles from "./../Home/Home.module.scss";
import { FaRegUserCircle } from "react-icons/fa";

function Information() {
    // Retrieve fullName from localStorage
    const fullName = localStorage.getItem("fullName") || "User";

    return (
        <div className={styles.User}>
            <FaRegUserCircle />
            {fullName}
        </div>
    );
}

export default Information;
