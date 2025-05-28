import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import styles from "./../Home/Home.module.scss"; // Import file SCSS của bạn
import { toast } from "react-toastify";

function ExportDialog({ isOpen, onRequestClose }) {
  const [exportFromDate, setExportFromDate] = useState("");
  const [exportToDate, setExportToDate] = useState("");
  const [fileName, setFileName] = useState(""); // State for file name
  const fixedFilePath = "C:\\Users\\QUAN\\Downloads\\acbd"; // Fixed path

  const handleExportSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedStartDate = new Date(exportFromDate).toISOString(); // Convert to ISO format
      const formattedEndDate = new Date(exportToDate).toISOString(); // Convert to ISO format
      const fullPath = `${fixedFilePath}\\${fileName}.xlsx`; // Append the filename to the fixed path

      const response = await axios.post(
        "http://localhost:8086/api/v1/export/export-offer",
        null,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            filePath: fullPath,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Export success");
        onRequestClose();
      } else {
        toast.error("Export failed!");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("An error occurred while exporting data.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Export Offers</h2>
      <form onSubmit={handleExportSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="fromDate">From Date</label>
          <input
            type="date"
            id="fromDate"
            value={exportFromDate}
            onChange={(e) => setExportFromDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="toDate">To Date</label>
          <input
            type="date"
            id="toDate"
            value={exportToDate}
            onChange={(e) => setExportToDate(e.target.value)}
            required
            min={exportFromDate}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fileName">File Name</label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
        </div>
        <div className={styles.modalActions}>
          <button type="submit">Submit</button>
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ExportDialog;
