import React, {useState, useEffect} from "react";
import axios from "axios";
import styles from "./JobDetail.module.scss";
import homeStyles from './../../Home/Home.module.scss';
import Nav from "../../common/Nav";
import {FaRegUserCircle} from "react-icons/fa";
import {useParams} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "../../common/Logout";

function JobDetail() {
    const [jobDetails, setJobDetails] = useState(null);
    const {id} = useParams();
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    `http://localhost:8086/api/v1/job/view/${id}`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setJobDetails(response.data);
            } catch (error) {
                console.error("There was an error fetching the user details!", error);
            }
        };

        fetchData();
    }, [id]);

    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className={styles.homeContainer}>
            <Nav/>
            <div className={styles.main}>
                <div className={homeStyles.nav}>
                    <h2>Job</h2>
                    <Logout/>
                </div>
                <div className={styles.jobDetailsMain}>
                    <div className={styles.header}>
                        <div>Job Details</div>
                        <p className={styles.noteCreate}>
                            Created {isToday(new Date(jobDetails.createdAt)) ? "today" : "on " + new Date(jobDetails.createdAt).toLocaleDateString()}, last updated by {jobDetails.updatedBy} {isToday(new Date(jobDetails.updatedAt)) ? "today" : "on " + new Date(jobDetails.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Job title</label>
                                <p>{jobDetails.jobTitle}</p>
                            </div>
                            <div className={styles.col}>
                                <label>Skills</label>
                                <div className={styles.tagContainer}>
                                    {jobDetails.skillNames.map((skill) => (
                                        <span key={skill} className={styles.tag}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Start Date</label>
                                <p>{new Date(jobDetails.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.col}>
                                <label>End Date</label>
                                <p>{new Date(jobDetails.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Salary Range</label>
                                <p>
                                    {jobDetails.salaryRangeFrom !== null ? `From ${jobDetails.salaryRangeFrom} VND ` : ""}
                                    {jobDetails.salaryRangeTo !== null ? `To ${jobDetails.salaryRangeTo} VND` : ""}
                                    {jobDetails.salaryRangeFrom === null && jobDetails.salaryRangeTo === null ? "Not specified" : ""}
                                </p>
                            </div>
                            <div className={styles.col}>
                                <label>Benefits</label>
                                <div className={styles.tagContainer}>
                                    {jobDetails.benefitNames.map((benefit) => (
                                        <span key={benefit} className={styles.tag}>{benefit}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Working address</label>
                                <p>
                                    {jobDetails.workingAddress !== "" ? jobDetails.workingAddress : "N/A"}
                                </p>
                            </div>
                            <div className={styles.col}>
                                <label>Level</label>
                                <div className={styles.tagContainer}>
                                    {jobDetails.levelNames.map((level) => (
                                        <span key={level} className={styles.tag}>{level}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Status</label>
                                <p>{jobDetails.status}</p>
                            </div>
                            <div className={styles.col}>
                                <label>Description</label>
                                <p>{jobDetails.description || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        {role !== "INTERVIEWER" && (
                            <a href={`/job/update/${id}`}>
                                <button className={styles.editBtn}>Edit</button>
                            </a>
                        )}
                        <button
                            className={styles.cancelBtn}
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetail;
