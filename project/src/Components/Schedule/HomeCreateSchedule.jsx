import { HttpClient } from "../../config/http-client";
import React, { useState, useEffect } from "react";
import styles from "../Candidate/viewList/CandidateList.module.scss";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { CandidateService } from "../../service/candidateService";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import Nav from '../../Components/common/Nav';
import Collapse from '@mui/material/Collapse';
import { IoMdAddCircleOutline } from "react-icons/io";
import axios from "axios";
const httpClient = new HttpClient();
const PAGE_SIZE = 10;
function HomeCreateSchedule() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [candidates, setCandidates] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openDropdown, setOpenDropdown] = useState({});
    const [jobList, setJobList] = useState({});
    const navigate = useNavigate();

    const candidateService = new CandidateService();

    const fetchCandidates = async (search, filter, currentPage) => {
        setLoading(true);
        setError("");
        try {
            const response = await httpClient.axiosInstance.get("/schedule/list/hasjob?size=9999");
            console.log(response.content);
            setCandidates(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            setError("No item matches with your search data. Please try again.");
            setCandidates([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        debouncedFetchCandidates(search, filter, currentPage);
        return () => debouncedFetchCandidates.cancel();
    }, [search, filter, currentPage]);

    const debouncedFetchCandidates = debounce((search, filter, currentPage) => {
        fetchCandidates(search, filter, currentPage);
    }, 800);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleViewDetail = (id) => {
        navigate(`/candidate/candidateDetail/${id}`);
    };

    const handleViewJobDetail = (id) => {
        navigate(`/job/view/${id}`);
    };
    const handleEdit = (id) => {
        navigate(`/candidate/editCandidate/${id}`);
    };

    const LoadingSpinner = () => (
        <div className="d-flex justify-content-center my-3">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const handleToggleDropdown = async (candidateId) => {
        setOpenDropdown((prevOpenDropdown) => ({
            ...prevOpenDropdown,
            [candidateId]: !prevOpenDropdown[candidateId],
        }));

        if (!jobList[candidateId]) {
            try {
                const response = await httpClient.axiosInstance.get(`schedule/list/candidateid?candidateId=${candidateId}`);
                setJobList((prevJobList) => ({
                    ...prevJobList,
                    [candidateId]: response.jobs,
                }));
            } catch (error) {
                console.error("Failed to fetch job list", error);
                setError(`Failed to fetch job list for candidate ${candidateId}. ${error.response ? error.response.data : error.message}`);
            }
        }
    };

    const handleJobClick = (job, candidate) => {
        navigate('/schedule/createSchedule', {
            state: {
                candidateName: candidate.fullName,
                recruiterName: candidate.recruiterName,
                jobName: job.jobTitle,
                jobId: job.id,
                candidateId: candidate.id,
            }
        });
    };


    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Candidate</h2>
                    <div className={styles["user-logout"]}>
                        <div className={styles.User}>User</div>
                        <a href="">
                            <FaRegUserCircle />
                            Logout
                        </a>
                    </div>
                </div>
                <div className={styles.name}>Home Create Schedule</div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No.</th>
                                <th>Position</th>
                                <th>Recruiter</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : candidates.length > 0 ? (
                                candidates.map((candidate, index) => (
                                    <React.Fragment key={index}>
                                        {/* Candidate Information Row */}
                                        <tr>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => handleToggleDropdown(candidate.id)}
                                                        className="btn btn-link p-0 d-flex align-items-center"
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        {openDropdown[candidate.id] ? (
                                                            <FaChevronUp />
                                                        ) : (
                                                            <FaChevronDown />
                                                        )}
                                                    </button>
                                                    {candidate.fullName}
                                                </div>
                                            </td>
                                            <td>{candidate.email || 'N/A'}</td>
                                            <td>{candidate.phoneNumber || 'N/A'}</td>
                                            <td>{candidate.positionName || 'N/A'}</td>
                                            <td>{candidate.recruiterName || 'N/A'}</td>
                                            <td className="d-flex justify-content-around">
                                                <button
                                                    onClick={() => handleViewDetail(candidate.id)}
                                                    className="btn btn-outline-info btn-sm"
                                                >
                                                    <TbListDetails />
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Job Information Rows */}
                                        {/* <tr>
                                            <td colSpan="6" style={{ padding: 0 }}>
                                                <Collapse in={openDropdown[candidate.id]}>
                                                    <div style={{ width: '100%' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'honeydew' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Job Title</th>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Working Address</th>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {jobList[candidate.id] ? (
                                                                    jobList[candidate.id].map((job) => (
                                                                        <tr key={job.id}>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.jobTitle || "N/A"}
                                                                            </td>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.workingAddress || "N/A"}
                                                                            </td>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.description || "N/A"}
                                                                            </td>
                                                                            <td style={{ marginLeft:'20px' ,padding: '10px' }}>
                                                                                <button
                                                                                    onClick={() => handleViewJobDetail(job.id)}
                                                                                style={{ color: 'blue', borderRadius: '10px', backgroundColor: 'antiquewhite' }} 
                                                                                >
                                                                                    Detail Job
                                                                            
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleJobClick(job, candidate)}
                                                                                    style={{
                                                                                        borderBottom: '1px solid #ddd', color: 'blue', borderRadius: '10px', backgroundColor: 'greenyellow'
                                                                                         }}
                                                                                >
                                                                                    Create schedule
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">
                                                                            <LoadingSpinner />
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <td colSpan="6" style={{ padding: 0 }}>
                                                <Collapse in={openDropdown[candidate.id]}>
                                                    <div style={{ width: '100%', position: 'relative' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'honeydew' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Job Title</th>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Working Address</th>
                                                                    <th style={{ backgroundColor: 'honeydew' }}>Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {jobList[candidate.id] ? (
                                                                    jobList[candidate.id].map((job) => (
                                                                        <tr key={job.id}>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.jobTitle || "N/A"}
                                                                            </td>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.workingAddress || "N/A"}
                                                                            </td>
                                                                            <td style={{ padding: '10px' }}>
                                                                                {job.description || "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="3" className="text-center">
                                                                            <LoadingSpinner />
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                        {jobList[candidate.id] && (
                                                            <div style={{ position: 'absolute', right: '0', top: '0', padding: '10px' }}>
                                                                {jobList[candidate.id].map((job) => (
                                                                    <div key={job.id} style={{ marginBottom: '10px' }}>
                                                                        <button
                                                                            onClick={() => handleViewJobDetail(job.id)}
                                                                            style={{ fontSize: '10px', marginTop: '22px', color: 'blue', borderRadius: '10px', backgroundColor: 'antiquewhite', marginRight: '10px' }}
                                                                        >
                                                                            Detail Job
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleJobClick(job, candidate)}
                                                                            style={{
                                                                                color: 'blue',
                                                                                fontSize: '10px', marginTop: '22px',
                                                                                borderRadius: '8px', backgroundColor: 'greenyellow'
                                                                            }}
                                                                        >
                                                                            Create Schedule
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No candidates available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



                <div className="d-flex justify-content-center my-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="btn btn-secondary me-2"
                    >
                        Previous
                    </button>
                    <span className="align-self-center">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary ms-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeCreateSchedule;
