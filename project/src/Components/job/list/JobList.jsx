import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './JobList.module.scss';
import homeStyles from './../../Home/Home.module.scss';
import { FaSearch, FaRegUserCircle } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { IoMdAddCircleOutline, IoMdCloudUpload } from 'react-icons/io';
import DeleteDialog from '../delete/DeleteDialog';
import { TbListDetails, TbTrash } from 'react-icons/tb';
import Nav from '../../common/Nav';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImportFileDialog from './ImportPopup';
import Logout from "../../common/Logout";

const PAGE_SIZE = 10;

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('authToken');

    const fetchData = async (page = 1, size = PAGE_SIZE, search = "", status = null) => {
        try {
            const response = await axios.get(
                `http://localhost:8086/api/v1/job/list`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                    params: {page: page - 1, size, search, status}
                }
            );
            setJobs(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log("data", response.data);
        } catch (error) {
            console.error("There was an error fetching the job list!", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage, PAGE_SIZE, search, status);
    }, [currentPage]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleStatusChange = (e) => {
        console.log("value", e.target.value)
        setStatus(e.target.value === "" ? null : e.target.value);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(1, PAGE_SIZE, search, status);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const openDeleteDialog = (id) => {
        setSelectedJobId(id);
        setShowDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedJobId(null);
    };

    const openImportDialog = () => {
        setShowImportDialog(true);
    };

    const closeImportDialog = () => {
        setShowImportDialog(false);
    };

    const handleRoleToAccessActionUpdateAndDeleteInJobList = (job) => {
        return (
            role !== "INTERVIEWER" && (
                <>
                    <a href={`/job/update/${job.id}`} className={styles.icontable}>
                        <CiEdit/>
                    </a>
                    <a onClick={() => openDeleteDialog(job.id)} className={styles.icontable} role="button"
                       aria-label="Delete job">
                        <TbTrash/>
                    </a>
                </>
            )
        );
    };

    const handleRoleToAccessActionCreateAndImportInJobList = () => {
        return (
            role !== "INTERVIEWER" && (
                <>
                    <div className={styles["create-upload"]}>
                        <a href={`/job/create`} className={styles.icon}>
                            <IoMdAddCircleOutline/>
                        </a>
                        <button onClick={openImportDialog} className={styles.icon} aria-label="Import file">
                            <IoMdCloudUpload />
                        </button>
                    </div>
                </>
            )
        );
    };

    const renderSkills = (skills) => {
        if (skills.length > 2) {
            const visibleSkills = skills.slice(0, 2).join(", ");
            const remainingSkills = skills.slice(2);
            const tooltip = skills.join(", ");
            return (
                <div className={styles.skills}>
                    <span>{visibleSkills} + {remainingSkills.length} other skills</span>
                    <div className={styles.tooltip}>{tooltip}</div>
                </div>
            );
        } else {
            return <span>{skills.join(", ")}</span>;
        }
    };

    const renderLevels = (levels) => {
        if (levels.length > 2) {
            const visibleLevels = levels.slice(0, 2).join(", ");
            const remainingLevels = levels.slice(2);
            const tooltip = levels.join(", ");
            return (
                <div className={styles.skills}>
                    <span>{visibleLevels} + {remainingLevels.length} other levels</span>
                    <div className={styles.tooltip}>{tooltip}</div>
                </div>
            );
        } else {
            return <span>{levels.join(", ")}</span>;
        }
    };

    return (
        <div className={styles.homeContainer}>
            <Nav/>
            <div className={styles.main}>
                <div className={homeStyles.nav}>
                    <h2>Job</h2>
                    <Logout />
                </div>
                <div className={styles.name}>Job List</div>
                <div className={styles["action-container"]}>
                    <div className={styles["search-container"]}>
                        <div className={styles["box-search"]}>
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={handleSearchChange}
                                required
                            />
                            <FaSearch className={styles.searchIcon}/>
                        </div>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className={styles.statusSearch}
                        >
                            <option value="">Status</option>
                            <option value="draft">Draft</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                        <button className={styles.search} onClick={handleSearch}>Search</button>
                    </div>
                    {handleRoleToAccessActionCreateAndImportInJobList()}
                </div>
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Required Skills</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Level</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {jobs.map((job, index) => (
                            <tr key={index}>
                                <td className={styles.title}>{job.jobTitle}</td>
                                <td className={styles.skills}>{renderSkills(job.requiredSkills.map(skill => skill.name))}</td>
                                <td className={styles.textCenter}>{job.startDate?.toString().split("T")[0]}</td>
                                <td className={styles.textCenter}>{job.endDate?.toString().split("T")[0]}</td>
                                <td className={styles.skills}>{renderLevels(job.level.map(skill => skill.name))}</td>
                                <td className={styles.textCenter}>{job.status}</td>
                                <td>
                                    <a href={`/job/view/${job.id}`} className={styles.icontable}>
                                        <TbListDetails/>
                                    </a>
                                    {handleRoleToAccessActionUpdateAndDeleteInJobList(job)}
                                </td>
                            </tr>
                        ))}
                        {showDeleteDialog && (
                            <DeleteDialog id={selectedJobId} onClose={closeDeleteDialog}/>
                        )}
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
            <ImportFileDialog isOpen={showImportDialog} onClose={closeImportDialog} onSuccess={() => fetchData(currentPage, PAGE_SIZE, search, status)} />
        </div>
    );
}

export default JobList;
