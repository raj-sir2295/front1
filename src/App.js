import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://YOUR_PROJECT_REF.supabase.co"; // अपने Supabase project URL डालो
const supabaseKey = "YOUR_ANON_KEY"; // अपने Supabase anon key डालो
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

    // destructuring नहीं किया → ESLint error gone
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

// CSS styles (same as before)
const styles = { ... /* unchanged */ };

export default App;
