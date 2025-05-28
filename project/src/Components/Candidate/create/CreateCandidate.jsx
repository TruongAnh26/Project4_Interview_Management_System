import React, { useState, useEffect, useRef } from "react";
import styles from "./CreateCandidate.module.scss";
import { FaChessKing, FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CandidateService } from "../../../service/candidateService";
import Nav from "../../common/Nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import ConfirmModal from "../ConfirmModal";

import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist/webpack";

// Đặt đường dẫn tới worker của PDF.js
GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.js`;

function CreateCandidate() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fileSelect, setFileSelect] = useState("");
  const [levels, setLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidate, setCandidate] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    dob: "",
    note: "",
    positionId: "",
    status: "Open",
    skills: [],
    jobs: [],
    yearOfExperience: "",
    recruiterName: "",
    recruiterId: "",
    highestLevel: "",
    cvAttachment: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const inputRefs = {
    fullName: useRef(null),
    email: useRef(null),
    phoneNumber: useRef(null),
    gender: useRef(null),
    position: useRef(null),
    highestLevel: useRef(null),
    skills: useRef(null),
    jobs: useRef(null),
    cvAttachment: useRef(null),
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const candidateService = new CandidateService();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await candidateService.getCurrentUser();
        setCandidate((prevState) => ({
          ...prevState,
          recruiterName: response.name,
          recruiterId: response.id,
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load user data.");
      }
    };

    const fetchListMapCandidateData = async () => {
      try {
        const response = await candidateService.getListMapCandidate();
        setLevels(response.levels);
        setPositions(response.positions);
        setSkills(response.skills);
        setJobs(response.jobs);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
    fetchListMapCandidateData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "position") {
      const selectedPosition = positions.find((pos) => pos.name === value);
      setCandidate({
        ...candidate,
        positionId: selectedPosition ? selectedPosition.id : "",
      });
    } else {
      setCandidate({
        ...candidate,
        [name]: value,
      });
    }
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedSkillIds = selectedOptions.map((option) => option.value);
    setCandidate((prevState) => ({
      ...prevState,
      skills: selectedSkillIds,
    }));
  };

  const handleJobChange = (selectedOptions) => {
    const selectedJobIds = selectedOptions.map((option) => option.value);
    setCandidate((prevState) => ({
      ...prevState,
      jobs: selectedJobIds,
    }));
  };

  const formatOptions = (items) =>
    items.map((item) => ({ value: item.id, label: item.name }));

  const extractInfoFromPdf = async (pdf, pattern) => {
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const rawText = textContent.items.map((item) => item.str).join("***");

    const match = rawText.match(pattern);
    return match ? match[1].trim() : "";
  };
  // Utility function to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const extractSkillsFromPdf = async (pdf, skillsList) => {
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const rawText = textContent.items.map((item) => item.str).join("***");
    // console.log("raw text content: " + rawText);
    const skillsMap = new Map(
      skillsList.map((skill) => [
        escapeRegExp(skill.name.toLowerCase()),
        skill.id,
      ])
    );
    let skillIds = [];
    for (const [skillName, skillId] of skillsMap) {
      const skillPattern = new RegExp(`\\b${skillName}\\b`, "i");
      if (skillPattern.test(rawText.toLowerCase())) {
        skillIds.push(skillId);
      }
    }

    return skillIds;
  };

  const extractJobsFromPdf = async (pdf, jobsList) => {
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const rawText = textContent.items.map((item) => item.str).join("***");

    const jobPattern = /Apply for job:\s*([^\*]*)/i;
    const match = rawText.match(jobPattern);
    const appliedJobsText = match ? match[1].trim() : "";

    const appliedJobs = appliedJobsText.split(",").map((job) => job.trim());
    const cleanAppliedJobs = appliedJobs.map((job) =>
      job.replace(/[\*\s]+$/, "")
    );

    const jobsMap = new Map(
      jobsList.map((job) => [job.name.toLowerCase(), job.id])
    );

    let jobIds = [];
    for (const jobName of cleanAppliedJobs) {
      const jobId = jobsMap.get(jobName.toLowerCase());
      if (jobId) {
        jobIds.push(jobId);
      }
    }

    return jobIds;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      const loadingTask = getDocument(reader.result);
      const pdf = await loadingTask.promise;

      const skillIds = await extractSkillsFromPdf(pdf, skills);
      const jobIdsCV = await extractJobsFromPdf(pdf, jobs);

      const fullNamePattern = /Full Name:\s*([^\*]*)/i;
      const emailPattern = /Email:\s*([^\*]*)/i;
      const dobPattern = /DOB:\s*([^\*]*)/i;
      const addressPattern = /Address:\s*([^\*]*)/i;
      const phoneNumberPattern = /PhoneNumber:\s*([^\*]*)/i;
      const genderPattern = /Gender:\s*([^\*]*)/i;
      const yearOfExpPattern = /Year of Experience:\s*([^\*]*)/i;
      const highestLevelPattern = /Highest Level:\s*([^\*]*)/i;
      const positionPattern = /Current Position:\s*([^\*]*)/i;

      const fullNameCV = await extractInfoFromPdf(pdf, fullNamePattern);
      const emailCV = await extractInfoFromPdf(pdf, emailPattern);
      const dobCV = await extractInfoFromPdf(pdf, dobPattern);
      const addressCV = await extractInfoFromPdf(pdf, addressPattern);
      const phoneNumberCV = await extractInfoFromPdf(pdf, phoneNumberPattern);
      const genderCV = await extractInfoFromPdf(pdf, genderPattern);
      const yearOfExpCV = await extractInfoFromPdf(pdf, yearOfExpPattern);
      const highestLevelCV = await extractInfoFromPdf(pdf, highestLevelPattern);
      const positionCV = await extractInfoFromPdf(pdf, positionPattern);
      console.log("positionCV:" + positionCV);

      const positionsMap = new Map(
        positions.map((positon) => [positon.name.toLowerCase(), positon.id])
      );
      const positionIdCV = positionsMap.get(positionCV.toLowerCase());

      setCandidate((prevState) => ({
        ...prevState,
        cvAttachment: base64String,
        cvFile: file,
        fullName: fullNameCV || prevState.fullName,
        email: emailCV || prevState.email,
        dob: dobCV || prevState.dob,
        address: addressCV || prevState.address,
        phoneNumber: phoneNumberCV || prevState.phoneNumber,
        gender: genderCV || prevState.gender,
        skills: skillIds.length > 0 ? skillIds : prevState.skills,
        yearOfExperience: yearOfExpCV || prevState.yearOfExperience,
        positionId: positionIdCV || prevState.positionId,
        highestLevel: highestLevelCV || prevState.highestLevel,
        jobs: jobIdsCV.length > 0 ? jobIdsCV : prevState.jobs,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const getBlobUrl = (base64String, mimeType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const validateForm = () => {
    const errors = {};
    if (!candidate.fullName) errors.fullName = "Please enter the full name.";
    if (!candidate.email) errors.email = "Please enter the email.";
    if (!candidate.phoneNumber)
      errors.phoneNumber = "Please enter the phone number.";
    if (!candidate.gender) errors.gender = "Please select the gender.";
    if (!candidate.positionId) errors.position = "Please select a position.";
    if (!candidate.highestLevel)
      errors.highestLevel = "Please select the highest level.";
    if (candidate.skills.length === 0)
      errors.skills = "Please select at least one skill.";
    if (candidate.jobs.length === 0)
      errors.jobs = "Please select at least one job.";
    if (!candidate.cvAttachment) errors.cvAttachment = "Please attach a CV.";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      inputRefs[firstErrorKey]?.current?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidate.email)) {
      toast.error("Invalid email format.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(candidate.phoneNumber)) {
      toast.error("Invalid phone number format.");
      return;
    }

    openConfirmModal();
  };

  const handleConfirmSave = async () => {
    try {
      const requestPayload = {
        fullName: candidate.fullName,
        dob: candidate.dob,
        phoneNumber: candidate.phoneNumber,
        email: candidate.email,
        gender: candidate.gender,
        address: candidate.address,
        cvAttachment: candidate.cvAttachment,
        note: candidate.note,
        yearOfExperience: candidate.yearOfExperience,
        highestLevel: candidate.highestLevel,
        positionId: candidate.positionId,
        recruiterId: candidate.recruiterId,
        skillIds: candidate.skills,
        jobIds: candidate.jobs,
        status: candidate.status,
      };

      await candidateService.createCandidate(requestPayload);
      console.log("Creation successful");
      toast.success("Creation successful");
      navigate(`/candidate/candidateList`);
    } catch (error) {
      console.log(error);
      if (error.response.data.code === "ME0104") {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create candidate. Please try again.");
        setError("Failed to create candidate. Please try again.");
      }
    } finally {
      closeConfirmModal();
    }
  };

  const handleCancel = () => {
    navigate(`/candidate/candidateList`);
    // navigate(-1);
  };

  return (
    <div className={styles.candidateContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>Create Candidate</h2>
          <div className={styles.userLogout}>
            <div className={styles.user}>User</div>
            <a href="">
              <FaRegUserCircle />
              Logout
            </a>
          </div>
        </div>
        <div className={styles.navbar}>
          <a href="/candidate/candidateList" className={styles.back}>
            Candidate List
          </a>
          <span className={styles.separator}>{">"}</span>
          <span className={styles.back}>Create Candidate</span>
        </div>
        <div className={styles.candidateInfo}>
          <div className={styles.infoGroup}>
            <h4>I. Personal information</h4>
            <div className={styles.personalInfoLeft}>
              <p>
                Full name:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <input
                  type="text"
                  name="fullName"
                  value={candidate.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  ref={inputRefs.fullName}
                />
                {fieldErrors.fullName && (
                  <div className={styles.error}>{fieldErrors.fullName}</div>
                )}
              </p>
              <p className={styles.dateOfBirth}>
                D.O.B:
                <input
                  type="date"
                  name="dob"
                  value={candidate.dob}
                  onChange={handleChange}
                  placeholder="Enter date of birth"
                  min="1900-01-01"
                  max="2100-12-31"
                  className={styles.inputDate}
                />
              </p>

              <p>
                Phone number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={candidate.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  ref={inputRefs.phoneNumber}
                />
                {fieldErrors.phoneNumber && (
                  <div className={styles.error}>{fieldErrors.phoneNumber}</div>
                )}
              </p>
            </div>
            <div className={styles.personalInfoRight}>
              <p>
                Email:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <input
                  type="email"
                  name="email"
                  value={candidate.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  ref={inputRefs.email}
                />
                {fieldErrors.email && (
                  <div className={styles.error}>{fieldErrors.email}</div>
                )}
              </p>
              <p>
                Address:
                <input
                  type="text"
                  name="address"
                  value={candidate.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </p>
              <p>
                Gender:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <select
                  name="gender"
                  value={candidate.gender}
                  onChange={handleChange}
                  ref={inputRefs.gender}
                  className={styles.selectCandidate}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.gender && (
                  <div className={styles.error}>{fieldErrors.gender}</div>
                )}
              </p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <h4>II. Professional information</h4>

            <div className={styles.personalInfoLeft}>
              <p>
                CV attachment:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  placeholder="Upload CV"
                  ref={inputRefs.cvAttachment}
                />
                {fieldErrors.cvAttachment && (
                  <div className={styles.error}>{fieldErrors.cvAttachment}</div>
                )}
                {candidate.cvAttachment && (
                  <a
                    href={getBlobUrl(candidate.cvAttachment, "application/pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CV
                  </a>
                )}
              </p>
              <p>
                Current Position:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <select
                  name="position"
                  value={
                    positions.find((pos) => pos.id === candidate.positionId)
                      ?.name || ""
                  }
                  onChange={handleChange}
                  ref={inputRefs.position}
                >
                  <option value="">Select position</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.name}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.position && (
                  <div className={styles.error}>{fieldErrors.position}</div>
                )}
              </p>
              <p>
                Skills:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <Select
                  isMulti
                  name="skills"
                  options={formatOptions(skills)}
                  value={candidate.skills.map((skillId) => ({
                    value: skillId,
                    label: skills.find((s) => s.id === skillId)?.name,
                  }))}
                  onChange={handleSkillChange}
                  ref={inputRefs.skills}
                />
                {fieldErrors.skills && (
                  <div className={styles.error}>{fieldErrors.skills}</div>
                )}
              </p>
              <p>
                Apply for jobs:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <Select
                  isMulti
                  name="jobs"
                  options={formatOptions(jobs)}
                  value={candidate.jobs.map((jobId) => ({
                    value: jobId,
                    label: jobs.find((s) => s.id === jobId)?.name,
                  }))}
                  onChange={handleJobChange}
                  ref={inputRefs.jobs}
                />
                {fieldErrors.jobs && (
                  <div className={styles.error}>{fieldErrors.jobs}</div>
                )}
              </p>
              <p>
                Recruiter:
                <input
                  type="text"
                  name="recruiterName"
                  value={candidate.recruiterName}
                  onChange={handleChange}
                  placeholder="Enter recruiter name"
                  readOnly
                />
              </p>
            </div>
            <div className={styles.personalInfoRight}>
              <p>
                Status:
                <input
                  type="text"
                  name="status"
                  value={candidate.status}
                  readOnly
                  placeholder
                />
              </p>
              <p>
                Year of Experience:
                <select
                  name="yearOfExperience"
                  value={candidate.yearOfExperience}
                  onChange={handleChange}
                >
                  {Array.from({ length: 31 }, (_, index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                Highest Level:
                <span className={styles.fieldrequiredCandidate}>*</span>
                <select
                  name="highestLevel"
                  value={candidate.highestLevel}
                  onChange={handleChange}
                  ref={inputRefs.highestLevel}
                >
                  <option value="">Select Highest Level</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.name}>
                      {level.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.highestLevel && (
                  <div className={styles.error}>{fieldErrors.highestLevel}</div>
                )}
              </p>

              <p>
                Note:
                <input
                  type="text"
                  name="note"
                  value={candidate.note}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                />
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button onClick={handleSave}>Submit</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}

export default CreateCandidate;
