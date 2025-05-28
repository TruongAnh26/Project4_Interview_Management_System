import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './../Home/Home.module.scss';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import { HttpClient } from "../../config/http-client";
import Nav from '../common/Nav';
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'; // Thêm thư viện thông báo
import { useLocation } from 'react-router-dom';

const PAGE_SIZE = 10;


function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [interviewer, setInterviewer] = useState([]);
    const [status, setStatus] = useState([]);

    const [filter, setFilter] = useState({ search: '', interviewerId: '', status: '' });

    const navigate = useNavigate();
    const httpClient = new HttpClient();

    const handleChangeFilter = (e) => {
        setFilter((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,

        }));
    }
    const location = useLocation();
    const message = location.state?.message;
    useEffect(() => {
        if (location.state?.message) {
            // Hiển thị toast
            toast.success(location.state.message);

            // Xóa state sau khi hiển thị toast
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // pass value
    const handleScheduleClick = (schedule) => {
        navigate('/offer/createoffer', {
            state: {
                scheduleId: schedule.id,
                scheduleTitle: schedule.scheduleTitle,
                candidateName: schedule.candidateInformation?.name,
                candidateId: schedule.candidateInformation?.id

            }
        });
    };

    // Code khác của component

    useEffect(() => {
        // let ENDPOINT = `http://localhost:8086/api/v1/schedule/search?interviewerId=${filter.interviewerId}`;
        let ENDPOINT = `http://localhost:8086/api/v1/schedule/search?`;
        if (filter.status) {
            ENDPOINT += '&status=' + filter.status;
        }
        if (filter.interviewerId) {
            ENDPOINT += "&interviewerId=" + filter.interviewerId;
        }
        if (filter.search) {
            ENDPOINT += '&search=' + filter.search;
        }
        const token = localStorage.getItem('authToken');
        try {
            async function fetchSearch() {
                const data = await axios.get(ENDPOINT, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Thay đổi 'Bearer' nếu cần
                    }
                })
                console.log(data)
                setSchedules(data.data.content)
            }
            fetchSearch();
        } catch (error) {
            console.error('error')
        }

    }, [filter]);
    const role = localStorage.getItem("role");
    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const response = await httpClient.axiosInstance.get(`schedule/list?size=99999`);

                let filteredSchedules = response.content || [];

                // Apply search filter
                if (filter.search) {
                    filteredSchedules = filteredSchedules.filter(schedule =>
                        schedule.scheduleTitle.toLowerCase().includes(filter.search.toLowerCase()) ||
                        schedule.candidateInformation.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                        schedule.interviewerInformation.some(interviewer => interviewer.fullName.toLowerCase().includes(filter.search.toLowerCase())) ||
                        schedule.timeSchedule.toLowerCase().includes(filter.search.toLowerCase()) ||
                        (schedule.result || "").toLowerCase().includes(filter.search.toLowerCase()) ||
                        (schedule.status || "").toLowerCase().includes(filter.search.toLowerCase()) ||
                        (schedule.jobScheduleResponse.jobTitle || "").toLowerCase().includes(filter.search.toLowerCase())
                    )
                }

                // Calculate total pages based on filtered data
                const totalFilteredSchedules = filteredSchedules.length;
                setTotalPages(Math.ceil(totalFilteredSchedules / PAGE_SIZE));

                // Update current page schedules
                setSchedules(filteredSchedules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
            
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [currentPage, filter.search]);
schedules.map(item => {
    console.log("item" , item);
    
})
    // get interviewers
    useEffect(() => {
        let ENDPOINT = `http://localhost:8086/api/v1/account/list`;
        const token = localStorage.getItem('authToken');
        try {
            async function fetchInterviewers() {
                const data = await axios.get(ENDPOINT, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Thay đổi 'Bearer' nếu cần
                    }
                })
                setInterviewer(data.data.content);
            }
            fetchInterviewers();
        } catch (error) {
            console.error('error')
        }

    }, []);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Schedule List</h2>
                    <div className={styles['user-logout']}>
                        <div className={styles.User}>User</div>
                        <a href="">
                            <FaRegUserCircle />Logout
                        </a>
                    </div>
                </div>
                <div className={styles.name}>Schedule List</div>
                <div className={styles['search-container']}>
                    <div className={styles['box-search']}>
                        <input style={{ padding: '18px' }}
                            type="text"
                            name='search'
                            placeholder="Search"
                            value={filter.search}
                            onChange={handleChangeFilter}
                            required
                        />
                        <FaSearch className={styles.searchIcon} />
                    </div>
                    <select
                        value={filter.interviewerId}
                        name='interviewerId'
                        onChange={handleChangeFilter}
                        className={styles.comboBox}
                    >
                        <option value="">Interviewer</option>
                        {interviewer && interviewer.map((inter) => (<option key={inter.id} value={inter.id}>{inter.username}</option>))}

                    </select>
                    <select
                        value={filter.status}
                        name='status'
                        onChange={handleChangeFilter}
                        className={styles.comboBox}
                    >
                        <option value="">Status</option>
                        <option value="Closed">Closed</option>
                        <option value="Open">Open</option>
                        <option value="Invited">Invited</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {role !== 'INTERVIEWER' && (
                        <a onClick={() => navigate("/schedule/homecreateschedule")} className={styles.icon}>
                            <IoMdAddCircleOutline />
                        </a>
                    )}

                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center'
                                    }}>Title</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Candidate Name</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Interviewers</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Schedule</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Result</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Status</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Job</th>
                                    <th style={{
                                        backgroundColor: '#E2BFB3',
                                        textAlign: 'center',
                                        padding: '20px'
                                    }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules && schedules.map((schedule, index) => (
                                    <tr key={index}>
                                        <td>{schedule.scheduleTitle || "N/A"}</td>
                                        <td>
                                            {schedule?.candidateInformation?.name ||"N/A"}
                                        </td>
                                        <td>
                                            {schedule.interviewerInformation && schedule.interviewerInformation.map((interviewer, interviewerIndex) => {
                                                // Ensure interviewer is not null or undefined
                                                if (!interviewer) return null;

                                                return (
                                                    <React.Fragment key={interviewerIndex}>

                                                        <div
                                                            data-tooltip-id={`tooltip-${interviewer.id}`}
                                                            data-tooltip-html={`<table style="border-collapse: collapse; width: 100%; color: white!important; border-radius: 50%;">
        <tr>
            <td style="padding: 8px; font-weight: bold; color: chartreuse;">Avatar:</td>
            <td style="padding: 8px;"><img src="https://via.placeholder.com/100" width="50" height="50" alt="Avatar" style="border-radius: 50%;" /></td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold; color: chartreuse;">Full Name:</td>
            <td style="padding: 8px;">${interviewer.fullName || 'N/A'}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold; color: chartreuse;">Email:</td>
            <td style="padding: 8px;">${interviewer.email || 'N/A'}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold; color: chartreuse;">Phone Number:</td>
            <td style="padding: 8px;">${interviewer.phoneNumber || 'N/A'}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;color: chartreuse;">Role:</td>
            <td style="padding: 8px;">${interviewer.role || 'N/A'}</td>
        </tr>
    </table>`}
                                                        >
                                                            {interviewer.username}{interviewerIndex < schedule.interviewerInformation.length - 1 ? ' , ' : ''}
                                                        </div>

                                                    </React.Fragment>
                                                );
                                            })}
                                            {schedule.interviewerInformation && schedule.interviewerInformation.map(interviewer => {
                                                // Ensure interviewer is not null or undefined
                                                if (!interviewer) return null;

                                                return (
                                                    <Tooltip key={interviewer.id} id={`tooltip-${interviewer.id}`} />
                                                );
                                            })}
                                        </td>

                                        <td>{schedule.timeSchedule || "N/A"}</td>
                                        <td>{schedule.result || "N/A"}</td>
                                        <td>{schedule.status || "N/A"}</td>

                                        <td>
                                            <span
                                                data-tooltip-id={`tooltip-job-${schedule.jobScheduleResponse?.id}`}
                                                data-tooltip-html={` <table>
                    <tr>
                        <td style="color: chartreuse;">Job Title:</td>
                        <td>${schedule.jobScheduleResponse?.jobTitle || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="color: chartreuse;">Working Address:</td>
                        <td>${schedule.jobScheduleResponse?.workingAddress || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="color: chartreuse;">Start Date:</td>
                        <td>${schedule.jobScheduleResponse?.startDate || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="color: chartreuse;">End Date:</td>
                        <td>${schedule.jobScheduleResponse?.endDate || 'N/A'}</td>
                    </tr>
                </table>`}
                                            >
                                                {schedule.jobScheduleResponse?.jobTitle}
                                            </span>
                                            <Tooltip id={`tooltip-job-${schedule.jobScheduleResponse?.id}`} />
                                        </td>

                                        <td style={{ display: 'flex', paddingBottom: '20%', }}>
                                            {role !== 'INTERVIEWER' && (
                                                <a style={{ marginTop: '20px' }}
                                                    onClick={() => {
                                                        if (schedule.status !== 'Invited') {
                                                            toast.info('You can only edit schedules with status "Invited".');
                                                        } else {
                                                            navigate(`/schedule/editschedule/${schedule.id}`);
                                                        }
                                                    }}
                                                    className={styles.icontable}
                                                >
                                                    <a style={{ marginTop: '20px' }}><CiEdit /></a>
                                                </a>
                                            )}
                                            {console.log(schedule.status)}
                                            <a style={{ marginTop: '40px' }} onClick={() => navigate(`/schedule/scheduledetail/${schedule.id}`)} className={styles.icontable}>
                                                <TbListDetails />
                                            </a>
                                            {schedule.result === 'Passed' && role !== 'INTERVIEWER' && (
                                                <button style={{
                                                    fontSize: '10px',
                                                    width: '57px',
                                                    height: '29px',
                                                    borderRadius: '10px',
                                                    backgroundColor: '#E2BFB3',
                                                    marginTop: '37px'

                                                }}
                                                    onClick={() => handleScheduleClick(schedule)}
                                                >
                                                    Add Offer
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className={styles.pagination}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
            <ToastContainer />
        </div >
    );
}

export default ScheduleList;

