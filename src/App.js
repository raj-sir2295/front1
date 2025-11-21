import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Date validation
    const today = new Date();
    const day = today.getDate();
    if (day < 20 || day > 30) {
      alert("कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।");
      return;
    }

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

    if (existing.length > 0) {
      alert(`Duplicate entry! "${form.fullName}" के लिए फीडबैक इस महीने पहले ही सबमिट हो चुका है।`);
      return;
    }

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

          {[
            "आपका जो TEACHER पढ़ा रहे हैं उसका BEHAVIOUR आपके साथ कैसा है?",
            "यदि आप Application देकर या बिना देकर CLASS से ABSENT होते हैं तो TEACHER आपको छुट्टा हुआ COURSE REPEAT कराते हैं या नहीं?",
            "आपकी TEACHER का समझाने का तरीका कैसा है?",
            "क्या आपकी TEACHER पढ़ाते समय CLASS में साफ–सफाई से संबंधित कोई बात बताते हैं?",
            "जो आप COMPUTER इस्तेमाल करते हैं उसका CONDITION अच्छा है या नहीं?",
            "क्या आप CLASS में साफ–सफाई से संबंधित कोई समस्या का सामना करते हैं?"
          ].map((text, i) => (
            <div key={i}>
              <p style={styles.question}>{i + 1}. {text}</p>

              {i === 0 || i === 2 ? (
                <div style={styles.radioRow}>
                  <label><input type="radio" name={`q${i+1}`} value="BAD" checked={form[`q${i+1}`] === "BAD"} onChange={handleChange}/> BAD</label>
                  <label><input type="radio" name={`q${i+1}`} value="GOOD" checked={form[`q${i+1}`] === "GOOD"} onChange={handleChange}/> GOOD</label>
                  <label><input type="radio" name={`q${i+1}`} value="GREAT" checked={form[`q${i+1}`] === "GREAT"} onChange={handleChange}/> GREAT</label>
                </div>
              ) : (
                <div style={styles.radioRow}>
                  <label><input type="radio" name={`q${i+1}`} value="YES" checked={form[`q${i+1}`] === "YES"} onChange={handleChange}/> YES</label>
                  <label><input type="radio" name={`q${i+1}`} value="NO" checked={form[`q${i+1}`] === "NO"} onChange={handleChange}/> NO</label>
                </div>
              )}
            </div>
          ))}

          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea name="suggestion" value={form.suggestion} onChange={handleChange} style={styles.textarea} />

          <button type="submit" style={styles.submitBtn}>सबमिट करें</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f5f5f5", padding: "30px", display: "flex", justifyContent: "center" },
  formCard: { background: "white", padding: "30px", width: "65%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  heading: { fontSize: "26px", fontWeight: "bold", textAlign: "center" },
  subHeading: { textAlign: "center", marginBottom: "20px", fontSize: "18px" },
  infoLabel: { color: "red", fontWeight: "bold", textAlign: "center", marginBottom: "15px" },
  sectionTitle: { marginTop: "20px", fontSize: "18px", fontWeight: "bold" },
  label: { marginTop: "10px", fontWeight: "bold" },
  input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "10px" },
  textarea: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "80px" },
  question: { marginTop: "15px", fontWeight: "bold" },
  radioRow: { display: "flex", gap: "20px", marginBottom: "10px" },
  submitBtn: { marginTop: "20px", width: "100%", padding: "15px", background: "blue", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", cursor: "pointer" },
};
