import React, { useState, useEffect } from "react";
import styles from './../Home/Home.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../common/Nav';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { colors } from "@mui/material";

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

function CreateSchedule() {
    const navigate = useNavigate();
    const information = useLocation();

    const [scheduleTitle, setScheduleTitle] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [notes, setNotes] = useState("");
    const [location, setLocation] = useState("");
    const [meeting, setMeeting] = useState("");
    const [interviewer, setInterviewer] = useState([]);
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [interviewerId, setInterviewerId] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [recruiterId, setRecruiterId] = useState("");
    const [recruiterName, setRecruiterName] = useState("");
    const [jobId, setJobId] = useState("");
    const [jobName, setJobName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [errorTitle, setErrorTile] = useState("");
    const [errorInterview, setErrorInterview] = useState("");
    const [errorDate, setErrorDate] = useState("");
    const [errorNowDate, setErrorNowDate] = useState("")
    const [errorTimeEnd, setErrorTimeEnd] = useState("");
    const [errorTimeStart, setErrorTimeStart] = useState("");
    const [errorDiffTime, setErrorDiffTime] = useState("");
    console.log(selectedInterviewers, 'selectedInterviewers')

    const formatOptions = (interviewers) => {
        return interviewers.map(interviewer => ({
            value: interviewer.id,
            label: interviewer.username
        }));
    };

    useEffect(() => {
        const ENDPOINT = `http://localhost:8086/api/v1/account/list`;
        const token = localStorage.getItem('authToken');

        const fetchInterviewers = async () => {
            try {
                const response = await axios.get(ENDPOINT, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setInterviewer(response.data.content);
            } catch (error) {
                console.error('Error fetching interviewers:', error);
                // setError(`Đã xảy ra lỗi: ${error.message}`);
                toast.error(`Error: ${error.message}`);
            }
        };

        fetchInterviewers();
    }, []);

    useEffect(() => {
        if (information.state) {
            setScheduleTitle(information.state.scheduleTitle || "");
            setCandidateName(information.state.candidateName || "");
            setCandidateId(information.state.candidateId || "");
            setRecruiterId(information.state.recruiterName || "");
            setRecruiterName(information.state.name || "")
            setJobId(information.state.jobId || "");
            setJobName(information.state.jobName)
        }
    }, [information.state]);
    const validateForm = () => {
        if (!scheduleTitle) {
            setErrorTile("Schedule Title is required.")
            return true
        };
        if (selectedInterviewers.length <= 0) {
            setErrorInterview("At least one interviewer must be selected.")
            return true

        };
        if (!scheduleDate) {
            setErrorDate("Schedule Date is required.")
            return true
        };
        if (new Date(scheduleDate) < new Date() - 1) {
            setErrorNowDate("Schedule Date must be today or a future date.")
            return true
        };
        if (!timeStart) {
            setErrorTimeStart("Schedule Start Time is required.")
            return true
        };
        if (!timeEnd) {
            setErrorTimeEnd("Schedule End Time is required.")
            return true
        };
        if (timeStart >= timeEnd) {
            setErrorDiffTime("Start Time must be before End Time.")
            return true
        };
        return false;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // setError("");
        setLoading(true);
        setSuccess(false);
        setEmailSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            // setError(validationError);
            setLoading(false);
            toast.error(validationError);
            return;
        }


        try {
            const scheduleTime = formatToISO(scheduleDate, timeStart);
            const timeStartISO = formatToISO(scheduleDate, timeStart);
            const timeEndISO = formatToISO(scheduleDate, timeEnd);

            const requestBody = {
                scheduleTitle,
                candidateName,
                scheduleTime,
                timeStart: timeStartISO,
                timeEnd: timeEndISO,
                notes,
                location,
                meeting,
                interviewerIds: selectedInterviewers.map(interviewer => interviewer.value),
                candidateId: parseInt(candidateId, 10),
                jobId: parseInt(jobId, 10)
            };
            console.log("Body:" + requestBody)

            const token = localStorage.getItem('authToken');

            const response = await fetch("http://localhost:8086/api/v1/schedule/create-new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
            }

            const responseData = await response.json();
            if (responseData.emailSent) {
                setEmailSuccess(true);
            }

            setSuccess(true);
            // toast.success("Schedule created successfully!");
            navigate("/schedule/schedulelist", { state: { message: "Schedule created successfully!" }, replace: true });
            // navigate("/schedule/schedulelist");
        } catch (error) {
            // setError(`Đã xảy ra lỗi: ${error.message}`);
            toast.error(`Error: Can't Create Schedule`);
        } finally {
            setLoading(false);
            // toast.dismiss(loadingToastId);
        }
    };

    const handleBack = () => {
        navigate(-1);
    }

    const handleCancel = () => {
        navigate(-1);
    }

    const customFilterOption = (option, searchText) => {
        return option.label.toLowerCase().includes(searchText.toLowerCase());
    };

    return (
        <div className={styles.homeContainer}>
            <Nav />
            <div className={styles.main}>
                <div className={styles.nav}>
                    <h2>Interview Schedule</h2>
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
                    <a href="" className={styles.createUser}>New interview schedule</a>
                </div>
                <div className={styles.userlistContainer}>
                    <form className={styles.userForm} >
                        <div className={styles.formGroup}>
                            <label htmlFor="scheduleTitle"><span style={{ color: 'red' }}>*</span>Schedule Title</label>
                            <input style={{ height: '43px', borderRadius: '5px' }}
                                type="text"
                                id="scheduleTitle"
                                name="scheduleTitle"
                                placeholder="Schedule title..."
                                value={scheduleTitle}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setErrorTile("")
                                        setScheduleTitle(e.target.value)
                                    }
                                }}
                            />
                            {errorTitle && <p style={{ fontSize: '15px', color: 'red' }}>{errorTitle}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="candidateName">Candidate Name</label>
                            <input style={{ height: '43px', borderRadius: '5px' }}
                                type="text"
                                id="candidateName"
                                name="candidateName"
                                placeholder="Candidate name..."
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="scheduleDate"><span style={{ color: 'red' }}>*</span>Schedule Date</label>
                            <input style={{ height: '43px', borderRadius: '5px' }}
                                type="date"
                                id="scheduleDate"
                                name="scheduleDate"
                                value={scheduleDate}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setErrorDate("")
                                        setErrorNowDate("")
                                        setScheduleDate(e.target.value)
                                    }
                                }}

                            />
                            {errorDate && <p style={{ fontSize: '15px', color: 'red' }}>{errorDate}</p>}
                            {errorNowDate && <p style={{ fontSize: '15px', color: 'red' }}>{errorNowDate}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="timeStart"><span style={{ color: 'red' }}>*</span>Time Start</label>
                            <input style={{ height: '43px', borderRadius: '5px', border: 'none' }}
                                type="time"
                                id="timeStart"
                                name="timeStart"
                                value={timeStart}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setErrorTimeStart("")
                                        setErrorDiffTime("")
                                        setTimeStart(e.target.value)
                                    }
                                }}

                            />
                            {errorTimeStart && <p style={{ fontSize: '15px', color: 'red' }}>{errorTimeStart}</p>}
                            {errorDiffTime && <p style={{ fontSize: '15px', color: 'red' }}>{errorDiffTime}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="timeEnd"><span style={{ color: 'red' }}>*</span>Time End</label>
                            <input style={{ height: '43px', borderRadius: '5px', border: 'none' }}
                                type="time"
                                id="timeEnd"
                                name="timeEnd"
                                value={timeEnd}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setErrorTimeEnd("")
                                        setTimeEnd(e.target.value)
                                    }
                                }}

                            />
                            {errorTimeEnd && <p style={{ fontSize: '15px', color: 'red' }}>{errorTimeEnd}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="notes" >Notes</label>
                            <textarea style={{ height: '43px', borderRadius: '5px' }}
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Type an location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="meeting">Meeting ID</label>
                            <input
                                type="text"
                                id="meeting"
                                name="meeting"
                                value={meeting}
                                onChange={(e) => setMeeting(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="recruiter">Recruiter </label>
                            <input
                                type="text"
                                id="recruiter"
                                name="recruiter"
                                placeholder="Recruiter"
                                value={recruiterId}
                                onChange={(e) => setRecruiterId(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="job">Job </label>
                            <input
                                type="text"
                                id="job"
                                name="job"
                                placeholder="Job"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="interviewers"><span style={{ color: 'red' }}>*</span>Interviewers</label>
                            <Select
                                isMulti
                                id="interviewers"
                                name="interviewers"
                                options={formatOptions(interviewer)}
                                value={selectedInterviewers}
                                onChange={(selected) => {
                                    console.log(selected)
                                    // selectedInterviewers.push(selected)
                                    setSelectedInterviewers(selected)

                                }}
                                filterOption={customFilterOption}
                            />
                            {errorInterview && <p style={{ fontSize: '15px', color: 'red' }}>{errorInterview}</p>}
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" style={{
                                backgroundColor: 'green',
                                borderRadius: '5px',
                                border: '1px solid black',
                                padding: '10px'
                            }}
                                onClick={handleSubmit}
                            >Submit
                            </button>
                            <button type="button" onClick={handleCancel}
                                style={{
                                    backgroundColor: 'red',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    padding: '10px'
                                }}
                            >Cancel</button>
                        </div>
                    </form>
                </div>
                {/* {success && <div className={styles.success}>Schedule created successfully!</div>} */}
                {/* {emailSuccess && <div className={styles.emailSuccess}>Create and sent email successfully!</div>} */}
                {/* {error && <div className={styles.error}>{error}</div>} */}
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
}

export default CreateSchedule;
