import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from './../Home/Home.module.scss';
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { TbListDetails } from "react-icons/tb";
import Nav from '../common/Nav';
import Logout from "../common/Logout";
import ExportDialog from './ExportDialog';

const PAGE_SIZE = 10;

const fetchOffers = async (search, departmentFilter, statusFilter, setOffers) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.error("No auth token found.");
            return;
        }

        const headers = {
            Authorization: `Bearer ${authToken}`
        };

        const params = {};
        if (search) params.search = search;
        if (departmentFilter) params.departmentId = parseInt(departmentFilter);
        if (statusFilter) params.status = statusFilter;

        const response = await axios.get("http://localhost:8086/api/v1/offer/list", {
            headers,
            params
        });

        // Kiểm tra nếu phản hồi có thông báo lỗi
        if (response.data.code === "ME008") {
            setOffers([]);
        } else {
            // Filter necessary fields from the response data
            const filteredData = response.data.content.map(offer => ({
                id: offer.id,
                candidateName: offer.candidate.name,
                email: offer.email,
                approverName: offer.approver.name,
                departmentName: offer.department.name,
                note: offer.note,
                status: offer.status
            }));
            setOffers(filteredData);
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setOffers([]);
        } else {
            console.error("Error fetching offers:", {
                message: error.message,
                response: error.response ? error.response.data : "No response data",
                status: error.response ? error.response.status : "No status",
                headers: error.response ? error.response.headers : "No headers"
            });
        }
    }
};

const fetchDepartments = async (setDepartments) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.error("No auth token found.");
            return;
        }

        const headers = {
            Authorization: `Bearer ${authToken}`
        };

        const response = await axios.get('http://localhost:8086/api/v1/master-data/department', {
            headers
        });

        setDepartments(Array.isArray(response.data.content) ? response.data.content : []);  // Ensure response.data.content is an array
    } catch (error) {
        console.error("Error fetching departments:", {
            message: error.message,
            response: error.response ? error.response.data : "No response data",
            status: error.response ? error.response.status : "No status",
            headers: error.response ? error.response.headers : "No headers"
        });
    }
};

function OfferList() {
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [offers, setOffers] = useState([]);
    const [departments, setDepartments] = useState([]);  // State for departments
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments(setDepartments);  // Fetch departments on component mount
        fetchOffers("", "", "", setOffers); // Fetch default offers on component mount
    }, []);

    const handleAddNew = () => {
        navigate('/offer/createoffer');
    }

    const handleExport = () => {
        setIsExportDialogOpen(true);
    };

    const handleCloseExportDialog = () => {
        setIsExportDialogOpen(false);
    };

    const handleSearch = () => {
        fetchOffers(search, departmentFilter, statusFilter, setOffers);
    };

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Offer</h2>
                    <Logout />
                </div>
                <div className={styles.name}>Offer List</div>
                <div className={styles['search-container']}>
                    <div className={styles['box-search']}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className={styles.searchIcon} />
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className={styles.comboBox}
                    >
                        <option value="">Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name.toUpperCase()}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.comboBox}
                    >
                        <option value="">Status</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="WAITING FOR APPROVAL">WAITING_FOR_APPROVAL</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="DECLINED">DECLINED</option>
                        <option value="WAITING FOR RESPONSE">WAITING_FOR_RESPONSE</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button className={styles.search} onClick={handleSearch}>Search</button>
                </div>
                <div className={styles.buttonoffer}>
                    <button className={styles.addnew} onClick={handleAddNew}>Add New</button>
                    <button className={styles.export} onClick={handleExport}>Export</button>
                </div>
                <ExportDialog isOpen={isExportDialogOpen} onRequestClose={handleCloseExportDialog} />
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th>Candidate Name</th>
                                <th>Email</th>
                                <th>Approver</th>
                                <th>Department</th>
                                <th>Notes</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.length > 0 ? (
                                offers.map((offer, index) => (
                                    <tr key={index}>
                                        <td>{offer.candidateName}</td>
                                        <td>{offer.email}</td>
                                        <td>{offer.approverName}</td>
                                        <td>{offer.departmentName}</td>
                                        <td>{offer.note}</td>
                                        <td>{offer.status}</td>
                                        <td>
                                            <div className={styles.actionbuttons}>
                                                <a href={`/offer/editoffer/${offer.id}`} className={styles.icontable}>
                                                    <CiEdit />
                                                </a>
                                                <a href={`/offer/offerdetail/${offer.id}`} className={styles.icontable}>
                                                    <TbListDetails />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className={styles.noData}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OfferList;
