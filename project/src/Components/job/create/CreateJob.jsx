import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./CreateJob.module.scss";
import homeStyles from './../../Home/Home.module.scss';
import Nav from "../../common/Nav";
import {FaRegUserCircle} from "react-icons/fa";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "../../common/Logout";

function CreateJob() {
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
                const response = await axios.get(`http://localhost:8086/api/v1/job/get-items-to-create-job`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setLevels(response.data.levels);
                setBenefits(response.data.benefits);
                setSkills(response.data.skills);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const draft = JSON.parse(localStorage.getItem("jobDraft"));
        if (draft) {
            setJobTitle(draft.jobTitle || "");
            setStartDate(draft.startDate || "");
            setEndDate(draft.endDate || "");
            setSalaryFrom(draft.salaryFrom || "");
            setSalaryTo(draft.salaryTo || "");
            setWorkingAddress(draft.workingAddress || "");
            setSelectedSkills(draft.selectedSkills || []);
            setSelectedBenefits(draft.selectedBenefits || []);
            setSelectedLevels(draft.selectedLevels || []);
            setDescription(draft.description || "");
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const draft = {
                jobTitle,
                startDate,
                endDate,
                salaryFrom,
                salaryTo,
                workingAddress,
                selectedSkills,
                selectedBenefits,
                selectedLevels,
                description
            };
            localStorage.setItem("jobDraft", JSON.stringify(draft));
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [jobTitle, startDate, endDate, salaryFrom, salaryTo, workingAddress, selectedSkills, selectedBenefits, selectedLevels, description]);

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
            console.log("data-sending", jobData)
            await axios.post(`http://localhost:8086/api/v1/job/create`, jobData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            toast.success("Job created successfully!");
            localStorage.removeItem("jobDraft");
            navigate("/job/list");
        } catch (error) {
            console.log("error: ",error)
            toast.error(error.response.data.message);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getNextDate = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

   const getPreviousDate = (dateStr) => {
       const date = new Date(dateStr);
       date.setDate(date.getDate() - 1);
       const year = date.getFullYear();
       const month = (date.getMonth() + 1).toString().padStart(2, '0');
       const day = date.getDate().toString().padStart(2, '0');
       return `${year}-${month}-${day}`;
   };
    const minStartDate = getCurrentDate();

    const maxStartDate = endDate ? getPreviousDate(endDate) : "";
    const minEndDate = startDate ? getNextDate(startDate) : getNextDate(getCurrentDate());

    const formatOptions = (items) => items.map(item => ({value: item.id, label: item.name}));

    return (
        <div className={styles.homeContainer}>
            <Nav/>
            <div className={styles.main}>
                <div className={homeStyles.nav}>
                    <h2>Job</h2>
                    <Logout/>
                </div>
                <div className={styles.createJobMain}>
                    <div className={styles.header}>
                        <h4>Create Job</h4>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.create}>
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
                                    ref={skillsRef}
                                    isMulti
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
                                           min={minStartDate}
                                           max={maxStartDate}
                                           value={startDate}
                                           ref={startDateRef}
                                           onChange={(e) => setStartDate(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <label>End Date <span className={styles.required}>*</span></label>
                                <div>
                                    <input type="date" min={minEndDate} value={endDate}
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

export default CreateJob;
