import React, { useState, useEffect } from "react";
import homeStyles from './../Home/Home.module.scss';
import createOfferStyles from './../../style/CreateOffer.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Nav from '../common/Nav';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Logout from "../common/Logout";

function CreateOffer() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the offer ID from the URL parameters
    const location = useLocation();
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [levels, setLevels] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [fullname, setFullName] = useState("");
    const [duedate, setDueDate] = useState("");
    const [approvers, setApprovers] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [recruites, setRecruites] = useState([]);
    const [position, setPosition] = useState("");
    const [approver, setApprover] = useState("");
    const [interviewinfos, setInterviewinfos] = useState([]);
    const [selectedInterviewInfo, setSelectedInterviewInfo] = useState("");
    const [roles, setRoles] = useState("");
    const [level, setLevel] = useState("");
    const [department, setDepartment] = useState("");
    const [recruiterowner, setRecruiterowner] = useState("");
    const [basicsalary, setBasicSalary] = useState("");
    const [contractperiodfrom, setContractPeriodFrom] = useState("");
    const [contractperiodto, setContractPeriodTo] = useState("");
    const [note, setNote] = useState("");
    const [interviewnote, setInterviewNote] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
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
                const interviewinfoResponse = await axios.get('http://localhost:8086/api/v1/master-data/interview', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const approverResponse = await axios.get('http://localhost:8086/api/v1/master-data/user', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { role: 'MANAGER' }
                });
                const recruitersResponse = await axios.get('http://localhost:8086/api/v1/master-data/user', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { role: 'RECRUITER' }
                });
                const candidateResponse = await axios.get('http://localhost:8086/api/v1/master-data/candidate', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 0, size: 200 }
                });

                setPositions(positionResponse.data.content || []);
                setDepartments(departmentResponse.data.content || []);
                setLevels(levelResponse.data.content || []);
                setContracts(contractResponse.data.content || []);
                setApprovers(approverResponse.data.content || []);
                setCandidates(candidateResponse.data.content || []);
                setRecruites(recruitersResponse.data.content || []);
                setInterviewinfos(interviewinfoResponse.data.content || []);

                if (id) {
                    const offerResponse = await axios.get(`http://localhost:8086/api/v1/offer/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const offer = offerResponse.data;
                    setFullName(offer.candidateId);
                    setPosition(offer.positionId);
                    setApprover(offer.approveId);
                    setSelectedInterviewInfo(offer.scheduleId);
                    setRoles(offer.contractId);
                    setLevel(offer.levelId);
                    setDepartment(offer.departmentId);
                    setRecruiterowner(offer.recruiterId);
                    setDueDate(offer.dueDate ? offer.dueDate.split('T')[0] : "");
                    setBasicSalary(offer.basicSalary);
                    setContractPeriodFrom(offer.from ? offer.from.split('T')[0] : "");
                    setContractPeriodTo(offer.to ? offer.to.split('T')[0] : "");
                    setNote(offer.note);
                    setInterviewNote(offer.interviewNote);
                } else if (location.state) {
                    setFullName(location.state.candidateId);
                    setSelectedInterviewInfo(location.state.scheduleId);
                    setInterviewNote(location.state.scheduleTitle);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [id, location.state]);

    const validateFields = () => {
        let formErrors = {};

        if (!fullname) formErrors.fullname = "Chưa nhập Candidate";
        if (!duedate) formErrors.duedate = "Chưa nhập Due Date";
        if (!position) formErrors.position = "Chưa chọn Position";
        if (!approver) formErrors.approver = "Chưa chọn Approver";
        if (!roles) formErrors.roles = "Chưa chọn Contract Type";
        if (!level) formErrors.level = "Chưa chọn Level";
        if (!department) formErrors.department = "Chưa chọn Department";
        if (!recruiterowner) formErrors.recruiterowner = "Chưa chọn Recruiter Owner";
        if (!basicsalary || basicsalary < 0) formErrors.basicsalary = "Chưa nhập Basic Salary hoặc lương cơ bản không thể âm";
        if (!contractperiodfrom) formErrors.contractperiodfrom = "Chưa nhập Contract Period From";
        if (!contractperiodto) formErrors.contractperiodto = "Chưa nhập Contract Period To";
        if (contractperiodfrom && contractperiodto && contractperiodfrom >= contractperiodto) formErrors.contractperiodto = "Contract Period To phải lớn hơn Contract Period From";
        if (contractperiodto && duedate && contractperiodto >= duedate) formErrors.duedate = "Due Date phải lớn hơn Contract Period To";

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateFields()) {
            return;
        }

        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn tạo mới offer này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        const offerRequest = {
                            candidateId: fullname,
                            positionId: position,
                            approveId: approver,
                            scheduleId: selectedInterviewInfo,
                            from: new Date(contractperiodfrom).toISOString(),
                            to: new Date(contractperiodto).toISOString(),
                            contractId: roles,
                            levelId: level,
                            departmentId: department,
                            recruiterId: recruiterowner || null,
                            dueDate: new Date(duedate).toISOString(),
                            basicSalary: parseFloat(basicsalary),
                            note: note,
                        };

                        try {
                            const token = localStorage.getItem("authToken");
                            if (!token) {
                                setError("Token không tồn tại. Vui lòng đăng nhập lại.");
                                return;
                            }

                            const response = await axios.post(
                                'http://localhost:8086/api/v1/offer',
                                offerRequest,
                                {
                                    headers: { Authorization: `Bearer ${token}` }
                                }
                            );

                            if (response.status === 200) {
                                navigate("/offer/offerlist");
                            } else {
                                setError("Đã xảy ra lỗi khi tạo offer.");
                            }
                        } catch (error) {
                            setError("Lỗi kết nối đến server.");
                            console.error("Error:", error);
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => {
                        // Do nothing
                    }
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

    const handleAssignToMe = () => {
        setRecruiterowner("1");
    };

    const handleBasicSalaryKeyPress = (e) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    };

    const handleContractPeriodFromChange = (e) => {
        setContractPeriodFrom(e.target.value);
        setContractPeriodTo(""); // Reset contract period to
    };

    const disablePastDates = () => {
        const fromDate = new Date(contractperiodfrom);
        const day = fromDate.getDate();
        const month = fromDate.getMonth() + 1; // Months are zero-indexed
        const year = fromDate.getFullYear();

        return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    };

    const handleInterviewInfoChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedInterviewInfo(selectedId);

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`http://localhost:8086/api/v1/offer/interview-info`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { id: selectedId }
            });
            const interviewInfo = response.data;
            setInterviewNote(interviewInfo.note || 'N/A');
        } catch (error) {
            console.error("Error fetching interview info", error);
            setInterviewNote('N/A');
        }
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
                    <a href="/offer/offerlist" className={homeStyles.back} onClick={handleBack}>Offer List</a>
                    <span className={homeStyles.separator}>></span>
                    <a href="" className={homeStyles.createUser}>Create Offer</a>
                </div>
                <div className={homeStyles.userlistContainer}>
                    <form className={homeStyles.userForm} onSubmit={handleSubmit}>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="candidate" className={createOfferStyles.required}>Candidate</label>
                            <select id="candidate" name="candidate" className={createOfferStyles.largeInput} required onChange={(e) => setFullName(e.target.value)} value={fullname}>
                                <option value="">Select Candidate Name...</option>
                                {candidates.length > 0 ? (
                                    candidates.map(candidate => (
                                        <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Candidates Available</option>
                                )}
                            </select>
                            {errors.fullname && <p className={createOfferStyles.errorMessage}>{errors.fullname}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="position" className={createOfferStyles.required}>Position</label>
                            <select id="position" name="position" className={createOfferStyles.largeInput} required onChange={(e) => setPosition(e.target.value)} value={position}>
                                <option value="">Select a Position</option>
                                {positions.length > 0 ? (
                                    positions.map(position => (
                                        <option key={position.id} value={position.id}>{position.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Positions Available</option>
                                )}
                            </select>
                            {errors.position && <p className={createOfferStyles.errorMessage}>{errors.position}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="approver" className={createOfferStyles.required}>Approver</label>
                            <select id="approver" name="approver" className={createOfferStyles.largeInput} required onChange={(e) => setApprover(e.target.value)} value={approver}>
                                <option value="">Select an approver</option>
                                {approvers.length > 0 ? (
                                    approvers.map(approver => (
                                        <option key={approver.id} value={approver.id}>{approver.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Approvers Available</option>
                                )}
                            </select>
                            {errors.approver && <p className={createOfferStyles.errorMessage}>{errors.approver}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="interviewinfo" className={createOfferStyles.required}>Interview Info</label>
                            <select id="interviewinfo" name="interviewinfo" className={createOfferStyles.largeInput} required onChange={handleInterviewInfoChange} value={selectedInterviewInfo}>
                                <option value="">Select an interview schedule title</option>
                                {interviewinfos.length > 0 ? (
                                    interviewinfos.map(interviewinfo => (
                                        <option key={interviewinfo.id} value={interviewinfo.id}>{interviewinfo.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Interview Info Available</option>
                                )}
                            </select>
                            {errors.interviewinfo && <p className={createOfferStyles.errorMessage}>{errors.interviewinfo}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="roles" className={createOfferStyles.required}>Contract Type</label>
                            <select id="roles" name="roles" className={createOfferStyles.largeInput} required onChange={(e) => setRoles(e.target.value)} value={roles}>
                                <option value="">Select a type contract</option>
                                {contracts.length > 0 ? (
                                    contracts.map(contract => (
                                        <option key={contract.id} value={contract.id}>{contract.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Contracts Available</option>
                                )}
                            </select>
                            {errors.roles && <p className={createOfferStyles.errorMessage}>{errors.roles}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="level" className={createOfferStyles.required}>Level</label>
                            <select id="level" name="level" className={createOfferStyles.largeInput} required onChange={(e) => setLevel(e.target.value)} value={level}>
                                <option value="">Select a level</option>
                                {levels.length > 0 ? (
                                    levels.map(level => (
                                        <option key={level.id} value={level.id}>{level.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Levels Available</option>
                                )}
                            </select>
                            {errors.level && <p className={createOfferStyles.errorMessage}>{errors.level}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="department" className={createOfferStyles.required}>Department</label>
                            <select id="department" name="department" className={createOfferStyles.largeInput} required onChange={(e) => setDepartment(e.target.value)} value={department}>
                                <option value="">Select a department</option>
                                {departments.length > 0 ? (
                                    departments.map(department => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Departments Available</option>
                                )}
                            </select>
                            {errors.department && <p className={createOfferStyles.errorMessage}>{errors.department}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="recruiterowner" className={createOfferStyles.required}>Recruiter Owner</label>
                            <select id="recruiterowner" name="recruiterowner" className={createOfferStyles.largeInput} required onChange={(e) => setRecruiterowner(e.target.value)} value={recruiterowner}>
                                <option value="">Select a recruiter owner</option>
                                {recruites.length > 0 ? (
                                    recruites.map(recruite => (
                                        <option key={recruite.id} value={recruite.id}>{recruite.name}</option>
                                    ))
                                ) : (
                                    <option value="">No Recruiters Available</option>
                                )}
                            </select>

                            {errors.recruiterowner && <p className={createOfferStyles.errorMessage}>{errors.recruiterowner}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="basicsalary" className={createOfferStyles.required}>Basic Salary</label>
                            <input
                                type="number"
                                id="basicsalary"
                                name="basicsalary"
                                placeholder="Enter basic salary"
                                className={createOfferStyles.largeInput}
                                required
                                onChange={(e) => setBasicSalary(e.target.value)}
                                value={basicsalary}
                                min="0"
                                onKeyPress={handleBasicSalaryKeyPress}
                            />
                            {errors.basicsalary && <p className={createOfferStyles.errorMessage}>{errors.basicsalary}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="contractperiod" className={createOfferStyles.required}>Contract Period</label>
                            <label htmlFor="" className={createOfferStyles.smallLabel}>from</label>
                            <input
                                type="date"
                                id="contractperiodfrom"
                                name="contractperiodfrom"
                                className={createOfferStyles.largeInput}
                                required
                                onChange={handleContractPeriodFromChange}
                                value={contractperiodfrom}
                            />
                            {errors.contractperiodfrom && <p className={createOfferStyles.errorMessage}>{errors.contractperiodfrom}</p>}
                            <label htmlFor="" className={createOfferStyles.smallLabel}>to</label>
                            <input
                                type="date"
                                id="contractperiodto"
                                name="contractperiodto"
                                className={createOfferStyles.largeInput}
                                required
                                onChange={(e) => setContractPeriodTo(e.target.value)}
                                value={contractperiodto}
                                min={contractperiodfrom ? disablePastDates() : ""}
                                disabled={!contractperiodfrom}
                            />
                            {errors.contractperiodto && <p className={createOfferStyles.errorMessage}>{errors.contractperiodto}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="duedate" className={createOfferStyles.required}>Due Date</label>
                            <input
                                type="date"
                                id="duedate"
                                name="duedate"
                                className={createOfferStyles.largeInput}
                                value={duedate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                min={contractperiodto ? contractperiodto : ""}
                                disabled={!contractperiodto}
                            />
                            {errors.duedate && <p className={createOfferStyles.errorMessage}>{errors.duedate}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="note">Note</label>
                            <input type="text" id="note" name="note" placeholder="Type a note" className={createOfferStyles.largeInput} value={note} onChange={(e) => setNote(e.target.value)} />
                            {errors.note && <p className={createOfferStyles.errorMessage}>{errors.note}</p>}
                        </div>
                        <div className={createOfferStyles.OfferformGroup}>
                            <label htmlFor="interviewnote">Interview Notes</label>
                            <label className={createOfferStyles.largeInput}>{interviewnote}</label>
                            {errors.interviewnote && <p className={createOfferStyles.errorMessage}>{errors.interviewnote}</p>}
                        </div>

                        <div className={homeStyles.formActions}>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                    {error && <p className={homeStyles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default CreateOffer;
