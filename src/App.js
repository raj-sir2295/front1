import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup (your existing keys)
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: uploaded image local path (you said to include it)
const formImagePath = "/mnt/data/d34d0f39-da37-4735-86ee-e07a1511db63.jpeg";

// Questions with type: "3" => 3-option (GOOD/BETTER/BEST), "2" => YES/NO
const questions = [
  {
    text: "आपको जो TEACHER पढ़ा रहे हैं उनका BEHAVIOUR आपके साथ कैसा है?",
    type: "3",
  },
  {
    text:
      "यदि आप Application लेकर या टीचर को बुलाकर CLASS से ABSENT होते हों तो, TEACHER आपका छुट्टा हुआ COURSE REPEAT कराते हैं क्या?",
    type: "2",
  },
  {
    text: "आपकी TEACHER का समझाने का तरीका आपको कैसा लगता है?",
    type: "3",
  },
  {
    text: "क्या आप जो TEACHER पढ़ा रहा है, उससे आप संतुष्ट हो क्या?",
    type: "2",
  },
  {
    text: "जो आप COMPUTER इस्तेमाल करते हो वह बराबर काम करते हैं या नहीं?",
    type: "2",
  },
  {
    text: "क्या आप CLASS में साफ सफाई से संतुष्ट हो या नहीं?",
    type: "2",
  },
];

export default function MonthlyFeedbackForm() {
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    branch: "",
    joiningCourse: "",
    batchTime: "",
    teacherName: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date restriction (20-30)
    const today = new Date();
    const day = today.getDate();
    if (day < 20 || day > 30) {
      alert("⚠️ कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।");
      return;
    }

    // Required fields
    const requiredFields = [
      "fullName",
      "mobileNumber",
      "branch",
      "joiningCourse",
      "batchTime",
      "teacherName",
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
    ]; 

    for (let field of requiredFields) {
      if (!form[field]) {
        alert(`कृपया "${field}" फ़ील्ड भरें।`);
        return;
      }
    }

    const feedbackMonth = today.getMonth() + 1;
    const feedbackYear = today.getFullYear();

    // Duplicate check
    const { data: existing, error: selectError } = await supabase
      .from("feedback")
      .select("*")
      .eq("student_name", form.fullName)
      .eq("feedback_month", feedbackMonth)
      .eq("feedback_year", feedbackYear);

    if (selectError) {
      alert("Error checking duplicates: " + selectError.message);
      return;
    }

    if (existing && existing.length > 0) {
      alert(`Duplicate entry! "${form.fullName}" के लिए फीडबैक इस महीने पहले ही सबमिट हो चुका है।`);
      return;
    }

    // Insert feedback
    const { error } = await supabase.from("feedback").insert([
      {
        student_name: form.fullName,
        mobile_number: form.mobileNumber,
        branch: form.branch,
        joining_course: form.joiningCourse,
        batch_time: form.batchTime,
        teacher_name: form.teacherName,
        q1: form.q1,
        q2: form.q2,
        q3: form.q3,
        q4: form.q4,
        q5: form.q5,
        q6: form.q6,
        suggestion: form.suggestion,
        feedback_month: feedbackMonth,
        feedback_year: feedbackYear,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`फीडबैक सफलतापूर्वक "${form.fullName}" के लिए सबमिट हुआ!`);
      setForm({
        fullName: "",
        mobileNumber: "",
        branch: "",
        joiningCourse: "",
        batchTime: "",
        teacherName: "",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        suggestion: "",
      });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h1 style={styles.heading}>PROPER COMPUTER INSTITUTE OF TECHNOLOGIES</h1>
        <h2 style={styles.subHeading}>MONTHLY FEEDBACK FORM</h2>
        <p style={styles.infoLabel}>
          कृपया ध्यान दें: इस महीने केवल 20 तारीख़ से 30 तारीख़ तक ही फीडबैक फॉर्म भर सकते हैं।
        </p>

        {/* Optional: If you want to show the uploaded image above form, uncomment this:
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <img src={formImagePath} alt="form" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
        */}

        <form onSubmit={handleSubmit}>
          <h3 style={styles.sectionTitle}>STUDENT DETAILS</h3>

          <label style={styles.label}>FULL NAME *</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>MOBILE NUMBER *</label>
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>BRANCH *</label>
          <select name="branch" value={form.branch} onChange={handleChange} style={styles.input}>
            <option value="">--Select Branch--</option>
            <option value="Lalganj">Lalganj</option>
            <option value="Vaishali Nagar">Vaishali Nagar</option>
          </select>

          <label style={styles.label}>JOINING COURSE *</label>
          <input name="joiningCourse" value={form.joiningCourse} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>BATCH TIME *</label>
          <input name="batchTime" value={form.batchTime} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>TEACHER NAME *</label>
          <input name="teacherName" value={form.teacherName} onChange={handleChange} style={styles.input} />

          <h3 style={styles.sectionTitle}>प्रश्न</h3>

          {/* Render questions with proper option sets */}
          {questions.map((q, i) => {
            const key = `q${i + 1}`;
            return (
              <div key={key}>
                <p style={styles.question}>
                  {i + 1}. {q.text}
                </p>

                {/* 3-option: GOOD / BETTER / BEST */}
                {q.type === "3" && (
                  <div style={styles.radioRow}>
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="GOOD"
                        checked={form[key] === "GOOD"}
                        onChange={handleChange}
                      />{" "}
                      GOOD
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="BETTER"
                        checked={form[key] === "BETTER"}
                        onChange={handleChange}
                      />{" "}
                      BETTER
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="BEST"
                        checked={form[key] === "BEST"}
                        onChange={handleChange}
                      />{" "}
                      BEST
                    </label>
                  </div>
                )}

                {/* 2-option: YES / NO */}
                {q.type === "2" && (
                  <div style={styles.radioRow}>
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="YES"
                        checked={form[key] === "YES"}
                        onChange={handleChange}
                      />{" "}
                      हाँ
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="NO"
                        checked={form[key] === "NO"}
                        onChange={handleChange}
                      />{" "}
                      नहीं
                    </label>
                  </div>
                )}
              </div>
            );
          })}

          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea name="suggestion" value={form.suggestion} onChange={handleChange} style={styles.textarea} />

          <button type="submit" style={styles.submitBtn}>
            सबमिट करें
          </button>
        </form>
      </div>
    </div>
  );
}

// styles (kept similar to your previous styles)
const styles = {
  page: {
    background: "#f5f5f5",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },
  formCard: {
    background: "white",
    padding: "30px",
    width: "65%",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: { fontSize: "26px", fontWeight: "bold", textAlign: "center" },
  subHeading: { textAlign: "center", marginBottom: "20px", fontSize: "18px" },
  infoLabel: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "15px",
  },
  sectionTitle: { marginTop: "20px", fontSize: "18px", fontWeight: "bold" },
  label: { marginTop: "10px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "80px",
  },
  question: { marginTop: "15px", fontWeight: "bold" },
  radioRow: { display: "flex", gap: "20px", marginBottom: "10px" },
  submitBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "15px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
  },
};
