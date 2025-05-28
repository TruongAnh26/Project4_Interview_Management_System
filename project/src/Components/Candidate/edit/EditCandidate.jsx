import React, { useEffect, useState, useRef } from "react";
import styles from "./EditCandidate.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { CandidateService } from "../../../service/candidateService";
import Nav from "../../common/Nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import ConfirmModal from "../ConfirmModal";

function EditCandidate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    status: "",
    skillIds: [],
    jobIds: [],
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
    cvAttachment: useRef(null),
  };

  const [file, setFile] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const candidateService = new CandidateService();

  useEffect(() => {
    const fetchCandidateDetail = async () => {
      try {
        const response = await candidateService.getCandidateDetail(id);
        setCandidate(response);
        if (response.cvAttachment) {
          const byteCharacters = atob(response.cvAttachment);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setCvUrl(url);
        }
      } catch (error) {
        setError("Failed to fetch candidate details.");
      } finally {
        setLoading(false);
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

    fetchCandidateDetail();
    fetchListMapCandidateData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidate({
      ...candidate,
      [name]: value,
    });
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedSkillIds = selectedOptions.map((option) => option.value);
    setCandidate((prevState) => ({
      ...prevState,
      skillIds: selectedSkillIds,
    }));
  };

  const handleJobChange = (selectedOptions) => {
    const selectedJobIds = selectedOptions.map((option) => option.value);
    setCandidate((prevState) => ({
      ...prevState,
      jobIds: selectedJobIds,
    }));
  };

  const formatOptions = (items) =>
    items.map((item) => ({ value: item.id, label: item.name }));
  const levelOptions = formatOptions(levels);
  const positionOptions = formatOptions(positions);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result.split(",")[1]);
        const url = URL.createObjectURL(selectedFile);
        setCvUrl(url);
      };
      reader.readAsDataURL(selectedFile);
    }
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
    if (candidate.skillIds.length === 0)
      errors.skills = "Please select at least one skill.";
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
        cvAttachment: file ? file : candidate.cvAttachment,
        note: candidate.note,
        yearOfExperience: candidate.yearOfExperience,
        highestLevel: candidate.highestLevel,
        positionId: candidate.positionId,
        recruiterId: candidate.recruiterId,
        skillIds: candidate.skillIds,
        jobIds: candidate.jobIds,
        status: candidate.status,
      };
      await candidateService.editCandidate(id, requestPayload);
      console.log("Update successful");
      toast.success("Update successful");
      navigate(`/candidate/candidateList`);
    } catch (error) {
      toast.error("Failed to update candidate. Please try again.");
      setError("Failed to update candidate. Please try again.");
    } finally {
      closeConfirmModal();
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.candidateContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>Edit Candidate</h2>
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
          <span className={styles.back}>Edit Candidate</span>
        </div>
        <div className={styles.candidateInfo}>
          <div className={styles.infoGroup}>
            <h4>I. Personal information</h4>
            <div className={styles.personalInfoLeft}>
              <p>
                Full name:
                <input
                  type="text"
                  name="fullName"
                  value={candidate.fullName}
                  onChange={handleChange}
                  ref={inputRefs.fullName}
                />
                {fieldErrors.fullName && (
                  <div className={styles.error}>{fieldErrors.fullName}</div>
                )}
              </p>
              <p>
                D.O.B:
                <input
                  type="text"
                  name="dob"
                  value={candidate.dob}
                  onChange={handleChange}
                />
              </p>
              <p>
                Phone number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={candidate.phoneNumber}
                  onChange={handleChange}
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
                <input
                  type="email"
                  name="email"
                  value={candidate.email}
                  onChange={handleChange}
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
                />
              </p>
              <p>
                Gender:
                <select
                  name="gender"
                  value={candidate.gender}
                  onChange={handleChange}
                  ref={inputRefs.gender}
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
              <p className={styles.cvAttachmentContainer}>
                CV attachment:{" "}
                {candidate.cvAttachment ? (
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                ) : (
                  "No CV attached"
                )}
              </p>
              <div className={styles.uploadCvContainer}>
                <label htmlFor="fileInput">Upload New CV:</label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
              <p>
                Current Position:
                <Select
                  options={positionOptions}
                  value={positionOptions.find(
                    (option) => option.value === candidate.positionId
                  )}
                  onChange={(selectedOption) =>
                    setCandidate({
                      ...candidate,
                      positionId: selectedOption ? selectedOption.value : "",
                    })
                  }
                  ref={inputRefs.position}
                />
                {fieldErrors.position && (
                  <div className={styles.error}>{fieldErrors.position}</div>
                )}
              </p>
              <p>
                Skills:
                <Select
                  isMulti
                  name="skills"
                  options={formatOptions(skills)}
                  value={candidate.skillIds.map((skillId) => ({
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
                <Select
                  isMulti
                  name="jobs"
                  options={formatOptions(jobs)}
                  value={candidate.jobIds.map((jobId) => ({
                    value: jobId,
                    label: jobs.find((s) => s.id === jobId)?.name,
                  }))}
                  onChange={handleJobChange}
                />
              </p>
              <p>
                Recruiter:
                <input
                  type="text"
                  name="recruiterName"
                  value={candidate.recruiterName ?? "N/A"}
                  onChange={handleChange}
                />
              </p>
            </div>
            <div className={styles.personalInfoRight}>
              <p>
                Status:
                <select
                  name="status"
                  value={candidate.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Waiting for interview">
                    Waiting for interview
                  </option>
                  <option value="Cancelled interview">
                    Cancelled interview
                  </option>
                  <option value="Passed interview">Passed interview</option>
                  <option value="Failed interview">Failed interview</option>
                  <option value="Waiting for approval">
                    Waiting for approval
                  </option>
                  <option value="Approved offer">Approved offer</option>
                  <option value="Rejected offer">Rejected offer</option>
                  <option value="Waiting for response">
                    Waiting for response
                  </option>
                  <option value="Accepted offer">Accepted offer</option>
                  <option value="Declined offer">Declined offer</option>
                  <option value="Cancelled offer">Cancelled offer</option>
                  <option value="Banned">Banned</option>
                </select>
              </p>
              <p>
                Year of Experience:
                <input
                  type="text"
                  name="yearOfExperience"
                  value={candidate.yearOfExperience}
                  onChange={handleChange}
                />
              </p>
              <p>
                Highest Level:
                <Select
                  options={levelOptions}
                  value={levelOptions.find(
                    (option) => option.label === candidate.highestLevel
                  )}
                  onChange={(selectedOption) =>
                    setCandidate({
                      ...candidate,
                      highestLevel: selectedOption ? selectedOption.label : "",
                    })
                  }
                  ref={inputRefs.highestLevel}
                />
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
                />
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button onClick={handleSave}>Save</button>
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

export default EditCandidate;
