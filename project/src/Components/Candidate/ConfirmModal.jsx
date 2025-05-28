import React from "react";
import Modal from "react-modal";
import styles from "./ConfirmModal.module.scss";

Modal.setAppElement("#root");

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <div className="candidateModal">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Confirm Modal"
        className={styles.modalCandidate}
        overlayClassName={styles.overlayCandidate}
      >
        <h2>Confirmation</h2>
        <p>Are you sure you want to save the changes?</p>
        <div className={styles.actionsCandidate}>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onRequestClose}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
