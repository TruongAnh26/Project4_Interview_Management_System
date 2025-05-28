import React, { useState, useEffect } from "react";
import styles from "./CandidateList.module.scss";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { CiHome, CiUser, CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoIosPeople, IoMdAddCircleOutline } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import { CandidateService } from "../../../service/candidateService";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../../common/Nav";
import ConfirmModal from "../ConfirmModal";
import { UserPlus } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import Logout from "../../common/Logout";

const PAGE_SIZE = 10;

function CandidateList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [candidateIdToDelete, setCandidateIdToDelete] = useState(null);

  const openConfirmModal = (id) => {
    setCandidateIdToDelete(id);
    setIsConfirmModalOpen(true);
  };
  const closeConfirmModal = () => {
    setCandidateIdToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const candidateService = new CandidateService();

  const fetchCandidates = async (search, filter, currentPage) => {
    setLoading(true);
    setError("");
    try {
      const response = await candidateService.getCandidates(
        search,
        filter,
        currentPage - 1,
        PAGE_SIZE
      );
      setCandidates(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      setError("No item matches with your search data. Please try again.");
      setCandidates([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCandidates = debounce((search, filter, currentPage) => {
    fetchCandidates(search, filter, currentPage);
  }, 800);

  useEffect(() => {
    debouncedFetchCandidates(search, filter, currentPage);
    // Cleanup debounce on unmount
    return () => debouncedFetchCandidates.cancel();
  }, [search, filter, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleViewDetail = (id) => {
    navigate(`/candidate/candidateDetail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/candidate/editCandidate/${id}`);
  };

  const handleDelete = async () => {
    if (candidateIdToDelete === null) return;
    try {
      const response = await candidateService.deleteCandidate(
        candidateIdToDelete
      );
      if (response.code === "ME0999") {
        toast.success(response.message);
      }
      setCandidates((prevCandidates) =>
        prevCandidates.filter(
          (candidate) => candidate.id !== candidateIdToDelete
        )
      );
    } catch (error) {
      toast.error("Failed to delete candidate");
      console.error("Failed to delete candidate:", error);
    } finally {
      closeConfirmModal();
    }
  };

  const LoadingSpinner = () => <div className="spinner">Loading...</div>;

  return (
    <div className={styles.homeContainer}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.nav}>
          <h2>Candidate</h2>
          {/* <div className={styles["user-logout"]}>
            <div className={styles.User}>User</div>
            <a href="">
              <FaRegUserCircle />
              Logout
            </a>
          </div> */}
          <Logout />
        </div>
        <div className={styles.name}>Candidate List</div>
        <div className={styles["search-container"]}>
          <div className={styles["box-searchCandidate"]}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <FaSearch className={styles.searchIcon} />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.comboBoxCandidate}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Waiting for interview">Waiting for interview</option>
            <option value="Cancelled interview">Cancelled interview</option>
            <option value="Passed interview">Passed interview</option>
            <option value="Failed interview">Failed interview</option>
            <option value="Waiting for approval">Waiting for approval</option>
            <option value="Approved offer">Approved offer</option>
            <option value="Rejected offer">Rejected offer</option>
            <option value="Waiting for response">Waiting for response</option>
            <option value="Accepted offer">Accepted offer</option>
            <option value="Declined offer">Declined offer</option>
            <option value="Cancelled offer">Cancelled offer</option>
            <option value="Banned">Banned</option>
          </select>
          <button
            onClick={() =>
              (window.location.href = "/candidate/createCandidate")
            }
            className={styles.candidateIconButtonAdd}
          >
            Add new <UserPlus />
          </button>
        </div>
        {error && <div>{error}</div>}
        <div className={styles.tableContainerCandidate}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No.</th>
                <th>Current Position</th>
                <th>Owner HR</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className={styles.loadingRow}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : candidates.length > 0 ? (
                candidates.map((candidate, index) => (
                  <tr key={index}>
                    <td>{candidate.fullName}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phoneNumber}</td>
                    <td>{candidate.positionName}</td>
                    <td>{candidate.recruiterName ?? "N/A"}</td>
                    <td>{candidate.status}</td>
                    <td className={styles.actionCandidate}>
                      <button
                        onClick={() => handleViewDetail(candidate.id)}
                        // className={`${styles.icontableCandidate} ${styles.view}`}
                        className={styles.icontableCandidate}
                      >
                        <TbListDetails />
                      </button>
                      {role !== "INTERVIEWER" && (
                        <>
                          <button
                            onClick={() => handleEdit(candidate.id)}
                            className={`${styles.icontableCandidate} ${styles.edit}`}
                            // className={styles.icontableCandidate}
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => openConfirmModal(candidate.id)}
                            // className={`${styles.icontableCandidate} ${styles.delete}`}
                            className={styles.icontableCandidate}
                          >
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noDataRow}>
                    No candidates available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default CandidateList;
