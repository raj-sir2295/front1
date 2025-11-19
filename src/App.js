import React, { useState } from "react";
import axios from "axios";
function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    complaint: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "https://ccf9e25d-023c-4f20-b6a5-32443347aa6a-00-j911e4d07n8m.pike.replit.dev/submit",
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        student_id: formData.studentId,
        description: formData.complaint,
      }
    );

    alert(res.data.message);
  } catch (err) {
    alert("Error occurred!");
  }
};


  

  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>Student Feedback Form</h2>
        <p style={styles.subText}>
          Please use this form to submit a complaint regarding any issue related to your experience as a student.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name Row */}
          <div style={styles.row}>
            <div style={styles.fieldBox}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <div style={styles.fieldBox}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                style={styles.input}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            style={styles.inputFull}
            onChange={handleChange}
          />

          {/* Phone */}
          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            name="phone"
            style={styles.inputFull}
            onChange={handleChange}
          />

          {/* Student ID */}
          <label style={styles.label}>Student  Course</label>
          <input
            type="text"
            name="studentId"
            style={styles.inputFull}
            onChange={handleChange}
          />

          {/* Complaint */}
          <label style={styles.label}>Feedback About teaching and Teacher Description</label>
          <textarea
            name="complaint"
            rows={5}
            style={styles.textarea}
            onChange={handleChange}
          ></textarea>

          {/* Submit */}
          <button type="submit" style={styles.submitBtn}>Submit   Your Feedback</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f2f2f4",
    minHeight: "100vh",
    paddingTop: "40px",
    display: "flex",
    justifyContent: "center",
  },
  formCard: {
    width: "55%",
    background: "#fff",
    padding: "35px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.15)",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "10px",
    textAlign: "left",
  },
  subText: {
    fontSize: "15px",
    color: "#555",
    marginBottom: "25px",
  },
  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  fieldBox: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  inputFull: {
    padding: "12px",
    width: "100%",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "20px",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default App;
