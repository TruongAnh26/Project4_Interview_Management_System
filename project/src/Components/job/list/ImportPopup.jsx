import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ImportPopup.module.scss';
import {
    IoIosArrowBack, IoIosArrowForward,
    IoIosArrowRoundBack,
    IoIosSkipBackward, IoMdArrowBack, IoMdArrowRoundBack,
    IoMdCloudUpload,
    IoMdSkipBackward,
    IoMdSkipForward
} from 'react-icons/io';
import { toast } from 'react-toastify';

const ImportFileDialog = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Reset step and file when the dialog is closed
        if (!isOpen) {
            setFile(null);
            setFilePreview(null);
            setStep(1);
        }
    }, [isOpen]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
            setStep(2);
        } else {
            toast.error('Please upload a valid Excel file.');
        }
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'http://localhost:8086/api/v1/job/import',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            toast.success(response.data.message);
            onSuccess();
            setStep(1);
        } catch (error) {
            toast.error('Error uploading file');
        }
    };

    const handleConfirm = () => {
        handleFileUpload();
        onClose();
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            setStep(2);
        }
    };

    const handleCancel = () => {
        onClose();
        setStep(1);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                {step === 1 && (
                    <div className={styles.step}>
                        <div className={styles.titleStep}>
                            <h4>Step 1: Import File</h4>
                            <button onClick={handleCancel} className={styles.cancelButton}>x</button>
                        </div>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            key={file ? file.name : 'file-input'}
                        />
                    </div>
                )}
                {step === 2 && (
                    <div className={styles.step}>
                        <div className={styles.titleStep}>
                            <h4>Step 2: Preview File</h4>
                            <button onClick={handleCancel} className={styles.cancelButton}>x</button>
                        </div>
                        <div className={styles.previewContainer}>
                            <span>{file?.name}</span>
                            <a href={filePreview} target="_blank" rel="noopener noreferrer">
                                View file
                            </a>
                        </div>
                        <div className={styles.directionButton}>
                            <button className={styles.directionButtonBack} onClick={handleBack}>
                                <IoIosArrowBack />
                            </button>
                            <button className={styles.directionButtonNext} onClick={() => setStep(3)}>
                                <IoIosArrowForward />
                            </button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className={styles.step}>
                        <div className={styles.titleStep}>
                            <h4>Step 3: Confirm Upload</h4>
                            <button onClick={handleCancel} className={styles.cancelButton}>x</button>
                        </div>
                        <div className={styles.lastStepButton}>
                                <button className={styles.lastStepButtonCancel} onClick={handleBack}>Back</button>
                            <button className={styles.lastStepButtonImport} onClick={handleConfirm}>Import</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportFileDialog;
