import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './DeleteDialog.module.scss';

const DeleteDialog = ({ id, onClose }) => {
    const navigate = useNavigate();
    console.log("r-id", id);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.delete(
                `http://localhost:8086/api/v1/job/delete/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log(response);
            if (response.status === 200) {
                toast.success('Successfully deleted job');
                window.location.reload();
            } else {
                toast.error('Failed to delete job');
            }
        } catch (error) {
            console.error("There was an error deleting the job!", error);
            toast.error('Failed to delete job');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h4>Are you sure you want to delete this job?</h4>
                <div className={styles.dialogButton}>
                    <button className={styles.yes} onClick={handleDelete}>Yes</button>
                    <button className={styles.no} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;
