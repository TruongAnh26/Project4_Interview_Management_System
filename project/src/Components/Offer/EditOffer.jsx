import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import homeStyles from './../Home/Home.module.scss';
import createOfferStyles from './../../style/CreateOffer.module.scss';
import Nav from '../common/Nav';
import { confirmAlert } from 'react-confirm-alert'; // Import the confirm alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from "../common/Logout";

function EditOffer() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy id từ URL
    const [offer, setOffer] = useState({
        candidateId: "",
        positionId: "",
        approveId: "",
        scheduleId: "",
        from: "",
        to: "",
        contractId: "",
        levelId: "",
        departmentId: "",
        recruiterId: "",
        dueDate: "",
        basicSalary: "",
        note: "",
        status: "",
    });
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [levels, setLevels] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [interviewInfos, setInterviewInfos] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setError("Token không tồn tại. Vui lòng đăng nhập lại.");
                    return;
                }

                const positionResponse = await axios.get('http://localhost:8086/api/v1/master-data/position', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const departmentResponse = await axios.get('http://localhost:8086/api/v1/master-data/department', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const levelResponse = await axios.get('http://localhost:8086/api/v1/master-data/level', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const contractResponse = await axios.get('http://localhost:8086/api/v1/master-data/contract', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const approverResponse = await axios.get('http://localhost:8086/api/v1/master-data/user', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        role: 'MANAGER'
                    }
                });
                const recruiterResponse = await axios.get('http://localhost:8086/api/v1/master-data/user', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        role: 'RECRUITER'
                    }
                });
                const candidateResponse = await axios.get('http://localhost:8086/api/v1/master-data/candidate', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 0, size: 200 }
                });
                const interviewInfoResponse = await axios.get('http://localhost:8086/api/v1/master-data/interview', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPositions(positionResponse.data.content || []);
                setDepartments(departmentResponse.data.content || []);
                setLevels(levelResponse.data.content || []);
                setContracts(contractResponse.data.content || []);
                setApprovers(approverResponse.data.content || []);
                setCandidates(candidateResponse.data.content || []);
                setRecruiters(recruiterResponse.data.content || []);
                setInterviewInfos(interviewInfoResponse.data.content || []);

                const offerResponse = await axios.get(`http://localhost:8086/api/v1/offer`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { id }
                });

                if (offerResponse.data) {
                    setOffer({
                        candidateId: offerResponse.data.candidate.id,
                        positionId: offerResponse.data.position.id,
                        approveId: offerResponse.data.approver.id,
                        scheduleId: offerResponse.data.scheduleId,
                        from: offerResponse.data.from,
                        to: offerResponse.data.to,
                        contractId: offerResponse.data.contract.id,
                        levelId: offerResponse.data.level.id,
                        departmentId: offerResponse.data.department.id,
                        recruiterId: offerResponse.data.recruiter.id,
                        dueDate: offerResponse.data.dueDate,
                        basicSalary: offerResponse.data.basicSalary,
                        note: offerResponse.data.note,
                        status: offerResponse.data.status,
                        interviewNote: offerResponse.data.interviewNote || "N/A"
                    });

                    // Fetch interview note for the initial scheduleId
                    if (offerResponse.data.scheduleId) {
                        fetchInterviewNote(offerResponse.data.scheduleId);
                    }
                }
            } catch (error) {
                setError("Lỗi kết nối đến server.");
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [id]);

    const fetchInterviewNote = async (scheduleId) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get('http://localhost:8086/api/v1/offer/interview-info', {
                params: { id: scheduleId },
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            setOffer(prevState => ({
                ...prevState,
                interviewNote: data.note || "N/A"
            }));
        } catch (error) {
            setOffer(prevState => ({
                ...prevState,
                interviewNote: "N/A"
            }));
            console.error("Error fetching interview note:", error);
        }
    };

    const handleInterviewInfoChange = (e) => {
        const selectedInterviewInfoId = e.target.value;
        setOffer(prevState => ({
            ...prevState,
            scheduleId: selectedInterviewInfoId
        }));

        if (selectedInterviewInfoId) {
            fetchInterviewNote(selectedInterviewInfoId);
        } else {
            setOffer(prevState => ({
                ...prevState,
                interviewNote: "N/A"
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'basicSalary') {
            // Chỉ cho phép nhập số không âm
            if (!/^\d*\.?\d*$/.test(value)) {
                return;
            }
        }
        setOffer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có sẵn sàng nộp thông tin này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        // Clear previous success message
                        setSuccessMessage("");

                        // Perform validation and update logic
                        if (Number(offer.basicSalary) <= 0) {
                            setError("Basic Salary must be a positive number.");
                            return;
                        }

                        const fromDate = new Date(offer.from);
                        const toDate = new Date(offer.to);
                        const dueDate = new Date(offer.dueDate);
                        if (fromDate >= toDate || toDate >= dueDate) {
                            setError("Please check the dates for logical consistency.");
                            return;
                        }

                        try {
                            const token = localStorage.getItem("authToken");

                            // Convert date fields to OffsetDateTime format
                            const formattedOffer = {
                                ...offer,
                                from: new Date(offer.from).toISOString(),
                                to: new Date(offer.to).toISOString(),
                                dueDate: new Date(offer.dueDate).toISOString()
                            };

                            const response = await axios.put(`http://localhost:8086/api/v1/offer?id=${id}`, formattedOffer, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (response.status === 200) {
                                toast.success("Cập nhật thông tin thành công!");
                                navigate("/offer/offerlist");
                                setSuccessMessage("Cập nhật thông tin thành công!"); // Optionally navigate away or do additional actions
                            } else {
                                setError("An error occurred while updating the offer.");
                            }
                        } catch (error) {
                            setError("Connection error to the server.");
                            console.error("Error updating offer:", error);
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const disablePastDates = (currentDate) => {
        const date = new Date(currentDate);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();

        return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    };

    return (
        <div className={homeStyles.homeContainer}>
            <Nav />
            <div className={homeStyles.main}>
                <div className={homeStyles.nav}>
                    <h2>Offer</h2>
                    <Logout />
                </div>
                <div className={homeStyles.navbar}>
                    <a href="/offerlist" className={homeStyles.back} onClick={handleBack}>Offer List</a>
                    <span className={homeStyles.separator}>></span>
                    <a href="" className={homeStyles.createUser}>Edit Offer</a>
                </div>
                <div className={homeStyles.userlistContainer}>
                    <form className={homeStyles.userForm} onSubmit={handleSubmit}>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="candidateId" className={createOfferStyles.required}>Candidate</label>
                            <select id="candidateId" name="candidateId" className={createOfferStyles.largeInput} value={offer.candidateId} onChange={handleChange} required>
                                <option value="">Select Candidate Name...</option>
                                {candidates.map(candidate => (
                                    <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="positionId" className={createOfferStyles.required}>Position</label>
                            <select id="positionId" name="positionId" className={createOfferStyles.largeInput} value={offer.positionId} onChange={handleChange} required>
                                <option value="">Select a Position</option>
                                {positions.map(position => (
                                    <option key={position.id} value={position.id}>{position.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="approveId" className={createOfferStyles.required}>Approver</label>
                            <select id="approveId" name="approveId" className={createOfferStyles.largeInput} value={offer.approveId} onChange={handleChange} required>
                                <option value="">Select an approver</option>
                                {approvers.map(approver => (
                                    <option key={approver.id} value={approver.id}>{approver.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="scheduleId" className={createOfferStyles.required}>Interview Info</label>
                            <select id="scheduleId" name="scheduleId" className={createOfferStyles.largeInput} value={offer.scheduleId} onChange={handleInterviewInfoChange} required>
                                <option value="">Select Interview Info</option>
                                {interviewInfos.map(info => (
                                    <option key={info.id} value={info.id}>{info.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="from" className={createOfferStyles.required}>Contract Period</label>
                            <label htmlFor="from" className={createOfferStyles.smallLabel}>from</label>
                            <input
                                type="date"
                                id="from"
                                name="from"
                                className={createOfferStyles.largeInput}
                                value={offer.from.split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="to" className={createOfferStyles.smallLabel}>to</label>
                            <input
                                type="date"
                                id="to"
                                name="to"
                                className={createOfferStyles.largeInput}
                                value={offer.to.split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="contractId" className={createOfferStyles.required}>Contract Type</label>
                            <select id="contractId" name="contractId" className={createOfferStyles.largeInput} value={offer.contractId} onChange={handleChange} required>
                                <option value="">Select a type contract</option>
                                {contracts.map(contract => (
                                    <option key={contract.id} value={contract.id}>{contract.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="levelId" className={createOfferStyles.required}>Level</label>
                            <select id="levelId" name="levelId" className={createOfferStyles.largeInput} value={offer.levelId} onChange={handleChange} required>
                                <option value="">Select a level</option>
                                {levels.map(level => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="departmentId" className={createOfferStyles.required}>Department</label>
                            <select id="departmentId" name="departmentId" className={createOfferStyles.largeInput} value={offer.departmentId} onChange={handleChange} required>
                                <option value="">Select a department</option>
                                {departments.map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="recruiterId" className={createOfferStyles.required}>Recruiter Owner</label>
                            <select id="recruiterId" name="recruiterId" className={createOfferStyles.largeInput} value={offer.recruiterId} onChange={handleChange} required>
                                <option value="">Select a recruiter owner</option>
                                {recruiters.map(recruiter => (
                                    <option key={recruiter.id} value={recruiter.id}>{recruiter.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="basicSalary" className={createOfferStyles.required}>Basic Salary</label>
                            <input
                                type="text"
                                id="basicSalary"
                                name="basicSalary"
                                placeholder="Enter basic salary"
                                className={createOfferStyles.largeInput}
                                value={offer.basicSalary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="dueDate" className={createOfferStyles.required}>Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className={createOfferStyles.largeInput}
                                value={offer.dueDate.split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="status">Status</label>
                            <label id="status" name="status" className={createOfferStyles.labelcontainer}>{offer.status}</label>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="interviewNote" className={createOfferStyles.topic}>Interview Note</label>
                            <label id="interviewNote" name="interviewNote" className={createOfferStyles.largeInput}>{offer.interviewNote}</label>
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="note">Note</label>
                            <input type="text" id="note" name="note" placeholder="Type a note" className={createOfferStyles.note} value={offer.note} onChange={handleChange} />
                        </div>
                        <div className={homeStyles.formActions}>
                            {offer.status === 'WAITING_FOR_APPROVAL' && <button type="submit">Submit</button>}
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                    {error && <p className={homeStyles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default EditOffer;
