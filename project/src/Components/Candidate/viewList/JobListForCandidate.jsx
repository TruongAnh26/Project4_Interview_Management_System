import React, { useEffect, useState } from "react";
import "./JobListForCandidate.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { CandidateService } from "../../../service/candidateService";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist/webpack";

// Đặt đường dẫn tới worker của PDF.js
GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.js`;

const JobListForCandidate = () => {
  const [jobList, setJobList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const [levels, setLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const candidateService = new CandidateService();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8086/api/v1/candidate/getJobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJobList(response.data);
      } catch (error) {
        console.error("There was an error fetching the user details!", error);
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
      }
    };

    fetchData();
    fetchListMapCandidateData();
  }, []);

  const totalPages = Math.ceil(jobList.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobList.slice(indexOfFirstJob, indexOfLastJob);

  async function applyCV(jobId) {
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
        // recruiterId: candidate.recruiterId,
        skillIds: candidate.skills,
        jobIds: [jobId],
        status: candidate.status,
      };

      await candidateService.createCandidateFromCV(requestPayload);
      console.log("Creation successful");
      toast.success("Apply CV successful");
      // navigate(`/candidate/candidateList`);
    } catch (error) {
      if (error.response.data.code === "ME0104") {
        console.error(error.response.data.message);
      } else {
        console.error("Failed to Apply CV. Please try again.");
      }
      toast.error("Failed to Apply CV. Please try again.");
    }
  }

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
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="job-list-ForCandidate">
      <div className="bannerCandidate"></div>
      <div className="content-ForCandidate">
        <h1 className="jobList-ForCandidate">Danh sách các công việc</h1>
        <ul className="job-list">
          {currentJobs.map((job) => (
            <li key={job.id} className="job-item-ForCandidate">
              <h2 className="job-title">{job.job_title}</h2>
              <div className="job-info">
                <div className="job-left">
                  <p className="job-description">
                    <strong>Mô tả:</strong> {job.description}
                  </p>
                  <p className="job-date">
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {new Date(job.startDate).toLocaleDateString()}
                  </p>
                  <p className="job-date">
                    <strong>Ngày kết thúc:</strong>{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </p>
                  <p className="job-salary">
                    <strong>Mức lương:</strong> {job.salaryRangeFrom} -{" "}
                    {job.salaryRangeTo}
                  </p>
                </div>
                <div className="job-right">
                  <p className="job-address">
                    <strong>Địa chỉ làm việc:</strong> {job.workingAddress}
                  </p>
                  <p className="job-benefits">
                    <strong>Phúc lợi:</strong>{" "}
                    {job.benefits.map((benefit) => benefit.name).join(", ")}
                  </p>
                  <p className="job-skills">
                    <strong>Kỹ năng:</strong>{" "}
                    {job.skills.map((skill) => skill.name).join(", ")}
                  </p>
                  <p className="job-levels">
                    <strong>Trình độ:</strong>{" "}
                    {job.levels.map((level) => level.name).join(", ")}
                  </p>
                </div>
              </div>
              <input
                type="file"
                class="file-input"
                onChange={handleFileChange}
                placeholder="Apply CV"
              />
              <div>
                File PDF CV có các thông tin về FullName, Email, Gender,
                Position, Skills, Highest Level
              </div>
              <button className="apply-button" onClick={() => applyCV(job.id)}>
                Apply CV
              </button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobListForCandidate;
