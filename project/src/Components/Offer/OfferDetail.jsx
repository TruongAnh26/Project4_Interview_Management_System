import React, { useState, useEffect } from "react";
import homeStyles from './../Home/Home.module.scss';
import offerDetailStyles from './OfferDetail.module.scss';
import { FaRegUserCircle } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';
import axios from 'axios';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Logout from "../common/Logout";

function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [interviewInfo, setInterviewInfo] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const role = localStorage.getItem("role");
                setUserRole(role);

                if (!token) {
                    setError("Token không tồn tại. Vui lòng đăng nhập lại.");
                    return;
                }

                const response = await axios.get(`http://localhost:8086/api/v1/offer`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { id }
                });
                setOffer(response.data);

                // Fetch interview info if scheduleId exists
                if (response.data.scheduleId) {
                    await fetchInterviewInfo(response.data.scheduleId);
                }
            } catch (error) {
                if (error.response && error.response.data.code === "ERR1" && error.response.data.message === "RECORD_NOT_FOUND") {
                    setError("Offer không tồn tại.");
                } else {
                    console.error("Error fetching offer details", error);
                    setError("Đã xảy ra lỗi khi lấy thông tin offer.");
                }
            }
        };

        const fetchInterviewInfo = async (scheduleId) => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`http://localhost:8086/api/v1/offer/interview-info`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { id: scheduleId }
                });
                setInterviewInfo(response.data);
            } catch (error) {
                console.error("Error fetching interview info:", error);
                setError("Đã xảy ra lỗi khi lấy thông tin phỏng vấn.");
            }
        };

        fetchOfferDetails();
    }, [id]);

    const handleBack = () => {
        navigate("/offer/offerlist");
    };

    const updateOfferStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`http://localhost:8086/api/v1/offer/update-state`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { id, state: newStatus }
            });
            setOffer((prevOffer) => ({ ...prevOffer, status: newStatus }));
        } catch (error) {
            console.error("Error updating offer status", error);
            setError("Đã xảy ra lỗi khi cập nhật trạng thái offer.");
        }
    };

    const confirmUpdateStatus = (newStatus) => {
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn thay đổi trạng thái của offer thành ${newStatus} không?`,
            buttons: [
                {
                    label: 'Có',
                    onClick: () => updateOfferStatus(newStatus)
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleCancelOffer = () => {
        confirmUpdateStatus("CANCELLED");
    };

    const handleApproveOffer = () => {
        confirmUpdateStatus("APPROVED");
    };

    const handleRejectOffer = () => {
        confirmUpdateStatus("REJECTED");
    };

    const handleMarkAsSent = () => {
        confirmUpdateStatus("WAITING_FOR_RESPONSE");
    };

    const handleAcceptOffer = () => {
        confirmUpdateStatus("ACCEPTED");
    };

    const handleDeclineOffer = () => {
        confirmUpdateStatus("DECLINED");
    };

    const handleEditOffer = () => {
        navigate(`/offer/editoffer/${id}`);
    };

    const formatDate = (date) => {
        return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
    };

    return (
        <div className={homeStyles.homeContainer}>
            <Nav />
            <div className={homeStyles.main}>
                <div className={homeStyles.nav}>
                    <h2>Offer Details</h2>
                    <Logout />
                </div>
                <div className={homeStyles.navbar}>
                    <a href="/offer/offerlist" className={homeStyles.back} onClick={handleBack}>Offer List</a>
                    <span className={homeStyles.separator}>></span>
                    <a href="" className={homeStyles.createUser}>Offer Details</a>
                </div>
                <div className={homeStyles.userlistContainer}>
                    {error ? (
                        <p className={homeStyles.error}>{error}</p>
                    ) : (
                        offer && (
                            <>
                                {offer.status !== 'REJECTED' && (
                                    <div className={offerDetailStyles.buttonContainer}>
                                        {userRole === 'RECRUITER' && offer.status === 'WAITING_FOR_APPROVAL' && (
                                            <button
                                                onClick={handleCancelOffer}
                                                className={offerDetailStyles.cancelButton}
                                            >
                                                Cancel Offer
                                            </button>
                                        )}
                                        {(userRole === 'MANAGER' || userRole === 'ADMIN') && offer.status === 'WAITING_FOR_APPROVAL' && (
                                            <>
                                                <button
                                                    onClick={handleApproveOffer}
                                                    className={offerDetailStyles.approveButton}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={handleRejectOffer}
                                                    className={offerDetailStyles.rejectButton}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={handleCancelOffer}
                                                    className={offerDetailStyles.cancelButton}
                                                >
                                                    Cancel Offer
                                                </button>
                                            </>
                                        )}
                                        {(userRole === 'MANAGER' || userRole === 'ADMIN') && offer.status === 'APPROVED' && (
                                            <>
                                                <button
                                                    onClick={handleMarkAsSent}
                                                    className={offerDetailStyles.markassentButton}
                                                >
                                                    Mark as Sent to Candidate
                                                </button>
                                                <button
                                                    onClick={handleCancelOffer}
                                                    className={offerDetailStyles.cancelButton}
                                                >
                                                    Cancel Offer
                                                </button>
                                            </>
                                        )}
                                        {offer.status === 'WAITING_FOR_RESPONSE' && (
                                            <>
                                                <button
                                                    onClick={handleAcceptOffer}
                                                    className={offerDetailStyles.acceptedButton}
                                                >
                                                    Accept Offer
                                                </button>
                                                <button
                                                    onClick={handleDeclineOffer}
                                                    className={offerDetailStyles.declineButton}
                                                >
                                                    Decline Offer
                                                </button>
                                                <button
                                                    onClick={handleCancelOffer}
                                                    className={offerDetailStyles.cancelButton}
                                                >
                                                    Cancel Offer
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <form className={homeStyles.userForm}>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="candidate" className={offerDetailStyles.required}>Candidate</label>
                                        <label id="candidate" className={offerDetailStyles.largeInput}>{offer.candidate ? offer.candidate.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="position" className={offerDetailStyles.required}>Position</label>
                                        <label id="position" className={offerDetailStyles.largeInput}>{offer.position ? offer.position.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="approver" className={offerDetailStyles.required}>Approver</label>
                                        <label id="approver" className={offerDetailStyles.largeInput}>{offer.approver ? offer.approver.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="interviewinfo">Interview Info</label>
                                        <div>
                                            <label id="interviewinfo" className={offerDetailStyles.largeInput}>{'Interview Name: '}{interviewInfo ? interviewInfo.interviewName : 'N/A'}</label>
                                        </div>
                                        <div>
                                            <label id="interviewers" className={offerDetailStyles.largeInput}>{'Interviewers: '}{interviewInfo ? interviewInfo.interviewers : 'N/A'}</label>
                                        </div>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="roles" className={offerDetailStyles.required}>Contract Type</label>
                                        <label id="roles" className={offerDetailStyles.largeInput}>{offer.contract ? offer.contract.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="level" className={offerDetailStyles.required}>Level</label>
                                        <label id="level" className={offerDetailStyles.largeInput}>{offer.level ? offer.level.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="department" className={offerDetailStyles.required}>Department</label>
                                        <label id="department" className={offerDetailStyles.largeInput}>{offer.department ? offer.department.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="recruiterowner" className={offerDetailStyles.required}>Recruiter Owner</label>
                                        <label id="recruiterowner" className={offerDetailStyles.largeInput}>{offer.recruiter ? offer.recruiter.name : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="basicsalary" className={offerDetailStyles.required}>Basic Salary</label>
                                        <label id="basicsalary" className={offerDetailStyles.largeInput}>{offer.basicSalary || 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="contractperiod" className={offerDetailStyles.required}>Contract Period</label>
                                        <label htmlFor="" className={offerDetailStyles.smallLabel}>from</label>
                                        <label id="contractperiodfrom" className={offerDetailStyles.largeInput}>{formatDate(offer.from)}</label>
                                        <label htmlFor="" className={offerDetailStyles.smallLabel}>to</label>
                                        <label id="contractperiodto" className={offerDetailStyles.largeInput}>{formatDate(offer.to)}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="duedate" className={offerDetailStyles.required}>Due Date</label>
                                        <label id="duedate" className={offerDetailStyles.largeInput}>{formatDate(offer.dueDate)}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="note">Note</label>
                                        <label id="note" className={offerDetailStyles.largeInput}>{offer.note || 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="interviewnote">Interview Notes</label>
                                        <label id="interviewnote" className={offerDetailStyles.largeInput}>{interviewInfo ? interviewInfo.note : 'N/A'}</label>
                                    </div>
                                    <div className={offerDetailStyles.OfferformGroup}>
                                        <label htmlFor="status">Status</label>
                                        <label id="status" className={offerDetailStyles.largeInput}>{offer.status || 'N/A'}</label>
                                    </div>

                                    <div className={homeStyles.formActions}>
                                        <button type="button" onClick={handleBack}>Back</button>
                                        {(offer.status === 'WAITING_FOR_APPROVAL') && (
                                            <button type="button" onClick={handleEditOffer}>Edit</button>
                                        )}
                                    </div>
                                </form>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default OfferDetail;
