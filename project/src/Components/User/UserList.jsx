import React, { useState, useEffect } from "react";
import axios from "axios";
import homeStyles from "./../Home/Home.module.scss";
import styles from "./UserList.module.scss";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import Nav from "../common/Nav";
import Logout from "../common/Logout";

const PAGE_SIZE = 10;

function UserList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // Giá trị của combo box cho vai trò
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [userRole, setUserRole] = useState(""); // User role state

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserRole = async () => {
      const role = localStorage.getItem("role"); // Assuming the role is stored in localStorage
      setUserRole(role);
    };

    fetchUserRole();

    axios
      .get("http://localhost:8086/api/v1/account/list", {
        params: {
          search: search,
          role: filter === "" ? null : filter, // Nếu filter rỗng, gửi null để không lọc theo vai trò
          page: currentPage - 1, // API thường sử dụng chỉ số trang bắt đầu từ 0
          size: PAGE_SIZE,
        },
      })
      .then((response) => {
        setUsersData(response.data.content); // Dữ liệu người dùng
        setTotalPages(response.data.totalPages); // Tổng số trang
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [search, filter, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className={homeStyles.homeContainer}>
      <Nav />
      <div className={homeStyles.main}>
        <div className={homeStyles.nav}>
          <h2>User Management</h2>
          <Logout />
        </div>
        <div className={homeStyles.name}>User List</div>
        <div className={homeStyles["search-container"]}>
          <div className={homeStyles["box-search"]}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
              className={styles.input}
            />
            <FaSearch className={homeStyles.searchIcon} />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={homeStyles.comboBox}
          >
            <option value="">Role</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="INTERVIEW">Interview</option>
          </select>
          <a href="/user/createuser" className={homeStyles.icon}>
            <IoMdAddCircleOutline />
          </a>
        </div>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone No.</th>
                <th>Role</th>
                <th>Status</th>
                {userRole === "ADMIN" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  {userRole === "ADMIN" && (
                    <td className={styles["action-buttons"]}>
                      <a href={`/user/edituser/${user.id}`} className={homeStyles.icontable}>
                        <CiEdit />
                      </a>
                      <a href={`/user/userdetail/${user.id}`} className={homeStyles.icontable}>
                        <TbListDetails />
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserList;
