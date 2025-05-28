import React from "react";
import styles from "./Home.module.scss";
import homeStyles from "./Home.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";
import { TiShoppingBag } from "react-icons/ti";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import Nav from "../common/Nav";
import Logout from "../common/Logout";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>Homepage</h2>
          <Logout />
        </div>
        {/* Nội dung khác của trang */}
      </div>
    </div>
  );
}

export default Home;
