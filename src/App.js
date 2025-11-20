import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://YOUR_PROJECT_REF.supabase.co"; // अपने Supabase project URL डालो
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const result = await supabase
      .from("feedback") // अपनी table का नाम
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          student_id: formData.studentId,
          description: formData.complaint,
        },
      ]);

    if (result.error) {
      alert("Error occurred! " + result.error.message);
    } else {
      alert("Feedback submitted successfully!");
      // form reset
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        studentId: "",
        complaint: "",
      });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>Student Feedback Form</h2>
        <p style={styles.subText}>
          कृपया इस फॉर्म का उपयोग करके अपने अनुभव के बारे में फीडबैक दें।
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.fieldBox}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                style={styles.input}
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div style={styles.fieldBox}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                style={styles.input}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            style={styles.inputFull}
            value={formData.email}
            onChange={handleChange}
          />

          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            name="phone"
            style={styles.inputFull}
            value={formData.phone}
            onChange={handleChange}
          />

          <label style={styles.label}>Student Course / ID</label>
          <input
            type="text"
            name="studentId"
            style={styles.inputFull}
            value={formData.studentId}
            onChange={handleChange}
          />

          <label style={styles.label}>
            Feedback About Teaching and Teacher Description
          </label>
          <textarea
            name="complaint"
            rows={5}
            style={styles.textarea}
            value={formData.complaint}
            onChange={handleChange}
          ></textarea>

          <button type="submit" style={styles.submitBtn}>
            Submit Your Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

// CSS styles
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
