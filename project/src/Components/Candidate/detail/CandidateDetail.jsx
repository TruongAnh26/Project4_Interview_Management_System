import React, { useEffect, useState } from "react";
import styles from "./CandidateDetail.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { CiHome, CiUser } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";
import { TiShoppingBag } from "react-icons/ti";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { CandidateService } from "../../../service/candidateService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../../common/Nav";
import ConfirmModal from "../ConfirmModal";

function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [levels, setLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cvUrl, setCvUrl] = useState(null);
  const [isBanned, setIsBanned] = useState(false);
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
        setIsBanned(response.status === "Banned");
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

  // const handleEdit = () => {
  //   navigate(`/edit-candidate/${candidate.id}`);
  // };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleBanCandidate = async () => {
    try {
      const response = await candidateService.banCandidate(id);
      // if (response.code == "ME0997") {
      //   setIsBanned(!isBanned); // Chuyển đổi trạng thái ban/unban nếu thành công
      // } else {
      //   setError("Failed to ban/unban candidate.");
      // }
      setCandidate((prev) => ({ ...prev, status: "Banned" }));
      toast.success("banned successful candidate");
      setIsBanned(true);
    } catch (error) {
      console.error("Failed to ban candidate:", error);
    } finally {
      closeConfirmModal();
    }
  };

  const getSkillNameById = (id) => {
    const skill = skills.find((skill) => skill.id === id);
    return skill ? skill.name : "Unknown";
  };

  const getJobNameById = (id) => {
    const job = jobs.find((job) => job.id === id);
    return job ? job.name : "Unknown";
  };

  const getPositionNameById = (id) => {
    const position = positions.find((position) => position.id === id);
    return position ? position.name : "Unknown";
  };

  const role = localStorage.getItem("role");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!candidate) {
    return <div>No candidate data found.</div>;
  }

  return (
    <div className={styles.candidateContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>Candidate Detail</h2>
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
          <span className={styles.back}>Candidate Information</span>
          {/* <div className={styles.formBanActions}>
            <button
              onClick={handleBanCandidate}
              className={isBanned ? styles.unbanButton : styles.banButton}
            >
              {isBanned ? "Unban Candidate" : "Ban Candidate"}
            </button>
          </div> */}
          <div className={styles.formBanActionsCandidate}>
            {role !== "INTERVIEWER" && !isBanned && (
              <button onClick={openConfirmModal} className={styles.banButton}>
                Ban Candidate
              </button>
            )}
          </div>
        </div>
        <div className={styles.candidateInfo}>
          <div className={styles.infoGroup}>
            <h4>I. Personal information</h4>
            <div className={styles.personalInfoLeft}>
              <p>
                <strong>Full name:</strong> {candidate.fullName}
              </p>
              <p>
                <strong>D.O.B:</strong> {candidate.dob}
              </p>
              <p>
                <strong>Phone number:</strong> {candidate.phoneNumber}
              </p>
            </div>
            <div className={styles.personalInfoRight}>
              <p>
                <strong>Email:</strong> {candidate.email}
              </p>
              <p>
                <strong>Address:</strong> {candidate.address}
              </p>
              <p>
                <strong>Gender:</strong> {candidate.gender}
              </p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <h4>II. Professional information</h4>
            <div className={styles.personalInfoLeft}>
              <p>
                <strong>CV attachment:</strong>{" "}
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              </p>
              <p>
                <strong>Current Position:</strong>{" "}
                {getPositionNameById(candidate.positionId)}
              </p>
              <p>
                <strong>Skills:</strong>
              </p>
              <ul>
                {candidate.skillIds.map((skillId, index) => (
                  <li key={index}>{getSkillNameById(skillId)}</li>
                ))}
              </ul>
              <p>
                <strong>Apply for jobs:</strong>
              </p>
              <ul>
                {candidate.jobIds.map((jobId, index) => (
                  <li key={index}>{getJobNameById(jobId)}</li>
                ))}
              </ul>
              <p>
                <strong>Recruiter:</strong> {candidate.recruiterName ?? "N/A"}
              </p>
            </div>
            <div className={styles.personalInfoRight}>
              <p>
                <strong>Status:</strong> {candidate.status}
              </p>
              <p>
                <strong>Year of Experience:</strong>{" "}
                {candidate.yearsOfExperience}
              </p>
              <p>
                <strong>Highest level:</strong> {candidate.highestLevel}
              </p>
              <p>
                <strong>Note:</strong> {candidate.note}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        onConfirm={handleBanCandidate}
      />
    </div>
  );
}

export default CandidateDetail;
