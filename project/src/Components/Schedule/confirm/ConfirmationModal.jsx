// src/components/ConfirmationModal.js
import React from 'react';
import styles from './ConfirmationModal.module.scss'; // Đảm bảo có file SCSS tương ứng

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button id="yesButton" onClick={onConfirm}>Yes</button>
                    <button id="noButton" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;