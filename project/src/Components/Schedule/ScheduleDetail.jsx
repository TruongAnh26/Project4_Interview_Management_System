

import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './../Home/Home.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import { CiHome, CiUser } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";
import { TiShoppingBag } from "react-icons/ti";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import ConfirmationModal from '../Schedule/confirm/ConfirmationModal';
import style from './Detail.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import Nav from '../common/Nav';
import 'react-toastify/dist/ReactToastify.css';

function ScheduleDetail() {
    const [schedule, setSchedule] = useState(null);
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const [recruiter, setRecruiter] = useState(null);
    const [interviewerInfor, setInterviewerinfor] = useState([]);
    const [result, setResult] = useState("");
    const [notes, setNotes] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    useEffect(() => {
        const fetchScheduleDetail = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:8086/api/v1/schedule/detail?scheduleId=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSchedule(response.data);
                setRecruiter(response.data.recruiterInformation);
                setInterviewerinfor(response.data.interviewerInformation);
                
            } catch (error) {
                console.error("Error fetching schedule detail:", error);
                setError("Error fetching schedule details");
            }
        };

        if (id) {
            fetchScheduleDetail();
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };
    const role = localStorage.getItem("role");
    const handleSubmitEmail = async () => {
        const requestBody = {
            result: result,
            notes: notes
        };
        const token = localStorage.getItem('authToken');

        await toast.promise(
            fetch(`http://localhost:8086/api/v1/send-mail/schedule-duedate?scheduleId=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            }).then(async response => {
                if (response.ok) {
                    navigate("/schedule/schedulelist", { state: { message: 'Email sent successfully.' } });
                } else {
                    toast.error('Failed to send email.');
                }
            }),
            {
                pending: 'Sending email...',
                success: 'Email sent successfully.',
                error: 'Error sending email.'
            }
        );
    };

    const handleSubmitResult = async () => {
        const requestBody = {
            result: result,
            notes: notes
        };
        const token = localStorage.getItem('authToken');

        await toast.promise(
            fetch(`http://localhost:8086/api/v1/schedule/result-interview?scheduleId=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            }).then(async response => {
                if (response.ok) {
                    navigate("/schedule/schedulelist", { state: { message: 'Result submitted successfully.' } });
                } else {
                    toast.info('You should choose result to send');
                }
            }),
            {
                pending: 'Submitting result...',
                success:'Send result success',
                error: 'Error submitting result.'
            }
        );
    };

    const confirmCancel = async () => {
        const token = localStorage.getItem('authToken');

        await fetch(`http://localhost:8086/api/v1/schedule/cancel-interview?scheduleId=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            if (response.ok) {
                navigate("/schedule/schedulelist", { state: { message: 'Schedule cancelled successfully check.' } });
            } else {
                toast.info("You can't cancel schedule have status different Invited");
            }
        })

    };

    const handleCancel = () => {
        setShowModal(true);
    };

    const handleSendEmail = () => {
        setShowEmail(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseEmail = () => {
        setShowEmail(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
    };

    if (!schedule) return <div>Loading...</div>;

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Schedule Management</h2>
                    <div className={styles['user-logout']}>
                        <div className={styles.User}>User</div>
                        <a href="">
                            <FaRegUserCircle />Logout
                        </a>
                    </div>
                </div>
                <div className={styles.navbar}>
                    <a href="/schedule/schedulelist" className={styles.back} onClick={handleBack}>Schedule List</a>
                    <span className={styles.arrow}> &gt; </span>
                    <a href="" className={styles.createUser}>Schedule Details</a>
                </div>
                <div className={styles.userlistContainer}>
                    <form className={styles.userForm} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="scheduleTile">Schedule title:</label>
                            <div>{schedule.scheduleTitle || "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="job">Job</label>
                            <div>{schedule.jobInformation.name || "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="candidate">Candidate Name:</label>
                            <div>{schedule.candidateInformation.name || "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="interviewer">Interviewer:</label>
                            <div>{interviewerInfor && interviewerInfor.map(inter => inter.name).join(", ")}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="time">Schedule Time:</label>
                            <div>{schedule.timeSchedule || "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="location">Location:</label>
                            <div>{schedule.location || "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            Result:
                            <select style={{ height: '45px', borderRadius: '5px', maxWidth: '600px' }}
                                name="result"
                                onChange={(e) => setResult(e.target.value)}
                            >
                                <option value="">Select Result</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="note" >Note:</label>
                            <textarea style={{ height: '43px', borderRadius: '5px' }}
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="owner">Recruiter Owner:</label>
                            <div>{recruiter ? recruiter.name : "N/A"}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="meeting">Meeting ID:</label>
                            <div>{schedule.meeting || "N/A"}</div>
                        </div>
                        <div className={styles.formActions}>
                            {role !== 'INTERVIEWER' && (
                                <>
                                    <button type="button" onClick={handleCancel}
                                        style={{
                                            backgroundColor: 'red',
                                            borderRadius: '5px',
                                            border: '1px solid black',
                                            marginLeft: '50px',
                                            width: '200px'
                                        }}>Cancel Schedule</button>
                                    <button type="button" onClick={handleSendEmail}
                                        style={{
                                            backgroundColor: 'lightblue',
                                            borderRadius: '5px',
                                            border: '1px solid black',
                                            marginLeft: '50px',
                                            width: '200px'
                                        }}>Send Email</button>
                                </>
                            )}
                            {role === 'INTERVIEWER' && (
                                <button type="submit" onClick={handleSubmitResult} style={{
                                    backgroundColor: 'green',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginLeft: '50px',
                                    width: '200px'
                                }}>Submit Result</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmationModal
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={confirmCancel}
                message="Are you sure you want to cancel this schedule?"
            />
            <ConfirmationModal
                show={showEmail}
                onClose={handleCloseEmail}
                onConfirm={handleSubmitEmail}
                message="Are you sure you want to send email to Interviewer?"
            />

            <ToastContainer />
        </div>
    );
}

export default ScheduleDetail;
