import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from './../Home/Home.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../common/Nav';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatToISO = (date, time) => {
    if (!date || !time) return "";
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid date or time format");
    }
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid Date object");
    }
    return dateTime.toISOString();
};
function EditSchedule() {
    const navigate = useNavigate();
    const { scheduleId } = useParams();
    const [scheduleTitle, setScheduleTitle] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [timeSchedule, setTimeSchedule] = useState("");
    const [scheduleDate, setScheduleDate] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [interviewer, setInterviewer] = useState([]);
    const [interviewerNames, setInterviewerNames] = useState([]);
    const [result, setResult] = useState("");
    const [notes, setNotes] = useState("");
    const [location, setLocation] = useState("");
    const [meeting, setMeeting] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [interviewerId, setInterviewerId] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [recruiterId, setRecruiterId] = useState("");
    const [recruiter, setRecruiter] = useState("");
    const [jobId, setJobId] = useState("");
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);

    const validateForm = () => {
        if (!scheduleTitle) return "Schedule Title is required.";
        if (selectedInterviewers.length === 0) return "At least one interviewer must be selected.";
        if (!scheduleDate) return "Schedule Date is required.";
        if (new Date(scheduleDate) < new Date()) return "Schedule Date must be today or a future date.";
        if (!timeStart) return "Schedule Start Time is required.";
        if (!timeEnd) return "Schedule End Time is required.";
        if (timeStart >= timeEnd) return "Start Time must be before End Time.";
        if (!jobId) return "Job is required.";
        if (!recruiterId) return "Recruiter is required.";
        return null;
    };
    useEffect(() => {
        if (!scheduleId || scheduleId === "undefined") {
            setError("Schedule ID không hợp lệ.");
            return;
        }

        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:8086/api/v1/schedule/detail?scheduleId=${scheduleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setScheduleTitle(data.scheduleTitle || "");
                setCandidateName(data.candidateInformation.name || "");
                setTimeSchedule(data.timeSchedule || "");
                setInterviewerNames(data.interviewerInformation || []);
                setSelectedInterviewers(data.interviewerInformation.map(info => ({ value: info.id, label: info.name })));
                setResult(data.result || "");
                setNotes(data.notes || "");
                setLocation(data.location || "");
                setMeeting(data.meeting || "");
                setStatus(data.status || "");
                setRecruiter(data.recruiterInformation || "");
                setRecruiterId(data.recruiterInformation.id || "");
                setCandidateId(data.candidateInformation.id || "");
                setJobId(data.jobInformation.id || "");
            } catch (error) {
                console.error('API Error:', error);
                setError(`Đã xảy ra lỗi khi tải dữ liệu: ${error.message}`);
            }
        };

        fetchSchedule();
    }, [scheduleId]);
    useEffect(() => {
        if (timeSchedule) {
            const [date, timeRange] = timeSchedule.split(' ');
            const [startTime, endTime] = timeRange.split('-');
            setScheduleDate(date);
            setTimeStart(startTime);
            setTimeEnd(endTime);
        }
    }, [timeSchedule]);

    useEffect(() => {
        const ENDPOINT = `http://localhost:8086/api/v1/account/list`;
        const token = localStorage.getItem('authToken');
        async function fetchInterviewers() {
            try {
                const data = await axios.get(ENDPOINT, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setInterviewer(data.data.content);
            } catch (error) {
                console.error('Error fetching interviewers:', error);
            }
        }
        fetchInterviewers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!scheduleId || scheduleId === "undefined") {
            setError("Schedule ID không hợp lệ.");
            return;
        }

        try {
            const scheduleTimeISO = formatToISO(scheduleDate, timeStart);
            const timeStartISO = formatToISO(scheduleDate, timeStart);
            const timeEndISO = formatToISO(scheduleDate, timeEnd);
            const validationError = validateForm();
            if (validationError) {
                toast.error(validationError);
                return;
            }
            const requestBody = {
                scheduleTitle,
                candidateName,
                scheduleTime: scheduleTimeISO,
                timeStart: timeStartISO,
                timeEnd: timeEndISO,
                result,
                notes,
                location,
                meeting,
                status,
                interviewerIds: selectedInterviewers.map(interviewer => interviewer.value),
                candidateId: candidateId ? parseInt(candidateId, 10) : null,
                recruiterId: recruiterId ? parseInt(recruiterId, 10) : null,
                jobId: jobId ? parseInt(jobId, 10) : null
            };

            const token = localStorage.getItem('authToken');

            await axios.put(`http://localhost:8086/api/v1/schedule/update`, requestBody, {
                params: { scheduleId },
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/schedule/schedulelist", { state: { message: "Schedule updated successfully!" } });
        } catch (error) {
            console.error('API Error:', error);
            setError(`Đã xảy ra lỗi: ${error.message}`);
            toast.error(`Error: ${error.message}`);
        }
    }


    const handleCancel = () => {
        navigate("/schedule/schedulelist");
    }

    const formatOptions = (items) => items.map(item => ({ value: item.id, label: item.username }));
    console.log("RecruiterId: " + recruiterId + "candidateId: " + candidateId + "interviewerId:" + selectedInterviewers.map(interviewer => interviewer.value));

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Edit Schedule</h2>
                    <div className={styles['user-logout']}>
                        <div className={styles.User}>User</div>
                        <a href="#">
                            <FaRegUserCircle />Logout
                        </a>
                    </div>
                </div>
                <div className={styles.navbar}>
                    <a href="/schedule/schedulelist" className={styles.back}>Schedule List</a>
                    <span className={styles.arrow}> &gt; </span>
                    <a href="#" className={styles.createUser}>Edit interview schedule</a>
                </div>
                <div className={styles.userlistContainer}>
                    <form className={styles.userForm} >
                        <div className={styles.formGroup}>
                            <label htmlFor="scheduleTitle"><span style={{ color: 'red' }}>*</span>Schedule Title</label>
                            <input style={{ height: '45px', borderRadius: '5px' }}
                                type="text"
                                id="scheduleTitle"
                                name="scheduleTitle"
                                placeholder="Schedule title..."
                                value={scheduleTitle}
                                onChange={(e) => setScheduleTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="candidateName">Candidate Name</label>
                            <div style={{ height: '45px', borderRadius: '5px', backgroundColor: 'white', textAlign: 'justify', paddingTop: '2px' }}>{candidateName}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="scheduleDate"><span style={{ color: 'red' }}>*</span>Schedule Date</label>
                            <input style={{ height: '45px', borderRadius: '5px' }}
                                type="date"
                                id="scheduleDate"
                                name="scheduleDate"
                                placeholder="Schedule date..."
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="timeStart"><span style={{ color: 'red' }}>*</span>Start Time</label>
                            <input style={{ height: '45px', borderRadius: '5px', border: 'none' }}
                                type="time"
                                id="timeStart"
                                name="timeStart"
                                placeholder="Start time..."
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="timeEnd"><span style={{ color: 'red' }}>*</span>End Time</label>
                            <input style={{ height: '45px', borderRadius: '5px', border: 'none' }}
                                type="time"
                                id="timeEnd"
                                name="timeEnd"
                                placeholder="End time..."
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="interviewers"><span style={{ color: 'red' }}>*</span>Interviewers</label>
                            <Select style={{ height: '45px', borderRadius: '5px' }}
                                isMulti
                                id="interviewers"
                                name="interviewers"
                                options={formatOptions(interviewer)}
                                value={selectedInterviewers}
                                onChange={(selected) => setSelectedInterviewers(selected)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="result">Result</label>
                            <select style={{ height: '45px', borderRadius: '5px', maxWidth: '650px' }}
                                name="result"
                                value={result}
                                onChange={(e) => setResult(e.target.value)}
                            >
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="notes">Notes</label>
                            <textarea style={{ height: '45px', borderRadius: '5px' }}
                                id="notes"
                                name="notes"
                                placeholder="Notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="location">Location</label>
                            <input style={{ height: '45px', borderRadius: '5px' }}
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="recruiterId">Recruiter</label>
                            <select style={{ height: '45px', borderRadius: '5px', maxWidth: '600px' }}
                                name='recruiterId'
                                value={recruiterId}
                                onChange={(e) => setRecruiterId(e.target.value)}
                                className={styles.comboBox}
                            >
                                <option value="">{recruiter.name}</option>
                                {interviewer && interviewer.map((inter) => (
                                    <option key={inter.id} value={inter.id}>{inter.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="meeting">Meeting</label>
                            <input style={{ height: '45px', borderRadius: '5px' }}
                                type="text"
                                id="meeting"
                                name="meeting"
                                placeholder="Meeting..."
                                value={meeting}
                                onChange={(e) => setMeeting(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="status">Status</label>
                            <div style={{ height: '45px', borderRadius: '5px' }}>{status}</div>
                        </div>
                        <div className={styles.formGroup} style={{ flexDirection: 'row', alignContent: 'center', marginLeft: '80%' }}>
                            <button onClick={handleSubmit} type="submit" className={styles.saveBtn} style={{
                                backgroundColor: 'green',
                                borderRadius: '5px',
                                border: '1px solid black',
                                padding: '15px',
                                width: '300px'
                            }}>Save</button>
                            <button type="button" className={styles.cancelBtn} onClick={handleCancel} style={{
                                backgroundColor: 'red',
                                borderRadius: '5px',
                                border: '1px solid black',
                                marginLeft: '50px',
                                width: '300px'
                            }}>Cancel</button>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditSchedule;
