import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./UpdateJob.module.scss";
import homeStyles from './../../Home/Home.module.scss';
import Nav from "../../common/Nav";
import {FaRegUserCircle} from "react-icons/fa";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "../../common/Logout";

function UpdateJob() {
    const [levels, setLevels] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [skills, setSkills] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [workingAddress, setWorkingAddress] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const {id} = useParams();

    const navigate = useNavigate();
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const salaryFromRef = useRef(null);
    const salaryToRef = useRef(null);
    const skillsRef = useRef(null);
    const benefitsRef = useRef(null);
    const levelsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`http://localhost:8086/api/v1/job/get-items-to-update-job/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const jobDetail = response.data.jobDetail;
                const jobMap = response.data.jobMap;

                setJobTitle(jobDetail.jobTitle);
                setStartDate(jobDetail.startDate.split('T')[0]);
                setEndDate(jobDetail.endDate.split('T')[0]);
                setSalaryFrom(jobDetail.salaryRangeFrom || "");
                setSalaryTo(jobDetail.salaryRangeTo || "");
                setWorkingAddress(jobDetail.workingAddress);
                setDescription(jobDetail.description);
                setStatus(jobDetail.status);

                setSelectedSkills(jobDetail.skills.map(skill => ({value: skill.id, label: skill.name})));
                setSelectedBenefits(jobDetail.benefits.map(benefit => ({value: benefit.id, label: benefit.name})));
                setSelectedLevels(jobDetail.levels.map(level => ({value: level.id, label: level.name})));

                setLevels(jobMap.levels);
                setBenefits(jobMap.benefits);
                setSkills(jobMap.skills);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };
        fetchData();
    }, [id]);

    const validateInputs = () => {
        if (!jobTitle) {
            toast.error("Job title is required");
            return false;
        }
        if (!startDate) {
            toast.error("Start date is required");
            startDateRef.current.focus();
            return false;
        }
        if (!endDate) {
            toast.error("End date is required");
            endDateRef.current.focus();
            return false;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            toast.error("Start date must be before end date");
            startDateRef.current.focus();
            return false;
        }
        if (selectedSkills.length === 0) {
            toast.error("At least one skill is required");
            skillsRef.current.focus();
            return false;
        }
        if (selectedBenefits.length === 0) {
            toast.error("At least one benefit is required");
            benefitsRef.current.focus();
            return false;
        }
        if (selectedLevels.length === 0) {
            toast.error("At least one level is required");
            levelsRef.current.focus();
            return false;
        }
        if (salaryFrom && parseFloat(salaryFrom) < 0) {
            toast.error("Salary from cannot be negative");
            salaryFromRef.current.focus();
            return false;
        }
        if (salaryTo && parseFloat(salaryTo) < 0) {
            toast.error("Salary to cannot be negative");
            salaryToRef.current.focus();
            return false;
        }
        if (salaryFrom && salaryTo && parseFloat(salaryFrom) > parseFloat(salaryTo)) {
            toast.error("Salary from cannot be less than salary to");
            salaryFromRef.current.focus();
            return false;
        }
        return true;
    };

    const handleSalaryInput = (e, setValue) => {
        const value = e.target.value;
        if (/^\d{0,9}(\.\d{0,2})?$/.test(value)) {
            setValue(value);
        } else {
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        if (["-", "e", "E", "+"].includes(e.key)) {
            e.preventDefault();
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;
        try {
            const token = localStorage.getItem("authToken");
            const jobData = {
                jobTitle,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                salaryRangeFrom: salaryFrom === "" ? null : parseFloat(salaryFrom),
                salaryRangeTo: salaryTo === "" ? null : parseFloat(salaryTo),
                workingAddress,
                skillIds: selectedSkills.map(skill => skill.value),
                benefitIds: selectedBenefits.map(benefit => benefit.value),
                levelIds: selectedLevels.map(level => level.value),
                description
            };
            await axios.put(`http://localhost:8086/api/v1/job/update/${id}`, jobData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            toast.success("Job updated successfully!");
            navigate("/job/list");
        } catch (error) {
            console.error("There was an error updating the job!", error);
            toast.error(error.response.data.message);
        }
    };

    const formatOptions = (items) => items.map(item => ({value: item.id, label: item.name}));

    return (
        <div className={styles.homeContainer}>
            <Nav/>
            <div className={styles.main}>
                <div className={homeStyles.nav}>
                    <h2>Job</h2>
                    <Logout/>
                </div>
                <div className={styles.updateJobMain}>
                    <div className={styles.header}>
                        <h6>Update Job</h6>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.update}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Job Title <span className={styles.required}>*</span></label>
                                <div>
                                    <input type="text" value={jobTitle}
                                           onChange={(e) => setJobTitle(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <label>Skills <span className={styles.required}>*</span></label>
                                <Select
                                    isMulti
                                    ref={skillsRef}
                                    options={formatOptions(skills)}
                                    value={selectedSkills}
                                    onChange={setSelectedSkills}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Start Date <span className={styles.required}>*</span></label>
                                <div>
                                    <input type="date"
                                           value={startDate}
                                           ref={startDateRef}
                                           onChange={(e) => setStartDate(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <label>End Date <span className={styles.required}>*</span></label>
                                <div>
                                    <input type="date"
                                           value={endDate}
                                           ref={endDateRef}
                                           onChange={(e) => setEndDate(e.target.value)} required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Salary range</label>
                                <div className={styles.range}>
                                    <p>
                                        From
                                    </p>
                                    <p>
                                        <input type="number" placeholder="vnd"
                                               step="0.01"
                                               min="0"
                                               max="999999999.99"
                                               onKeyDown={handleKeyDown}
                                               value={salaryFrom}
                                               ref={salaryFromRef}
                                               onChange={(e) => handleSalaryInput(e, setSalaryFrom)}/>
                                    </p>
                                    <p>
                                        To
                                    </p>
                                    <p>
                                        <input type="number" placeholder="vnd" value={salaryTo}
                                               step="0.01"
                                               min="0"
                                               max="999999999.99"
                                               onKeyDown={handleKeyDown}
                                               ref={salaryToRef}
                                               onChange={(e) => handleSalaryInput(e, setSalaryTo)}/>
                                    </p>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <label>Benefits <span className={styles.required}>*</span></label>
                                <div>
                                    <Select
                                        ref={benefitsRef}
                                        isMulti
                                        options={formatOptions(benefits)}
                                        value={selectedBenefits}
                                        onChange={setSelectedBenefits}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Working Address</label>
                                <div>
                                    <input type="text" value={workingAddress}
                                           onChange={(e) => setWorkingAddress(e.target.value)}/>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <label>Level <span className={styles.required}>*</span></label>
                                <div>
                                    <Select
                                        ref={levelsRef}
                                        isMulti
                                        options={formatOptions(levels)}
                                        value={selectedLevels}
                                        onChange={setSelectedLevels}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Status</label>
                                <div>{status}</div>
                            </div>
                            <div className={styles.col}>
                                <label>Description</label>
                                <div>
                                    <input value={description}
                                           onChange={(e) => setDescription(e.target.value)}/>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2">Submit</button>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => window.history.back()}>Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateJob;
