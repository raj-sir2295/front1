import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MonthlyFeedbackForm() {
  const [form, setForm] = useState({
    fullName: "",
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
    setForm((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limit date from 20 to 30
    const today = new Date();
    const d = today.getDate();
    if (d < 20 || d > 30) {
      alert("⚠️ कृपया ध्यान दें: आप केवल 20 से 30 तारीख के बीच फॉर्म भर सकते हैं!");
      return;
    }

    // Required fields
    const requiredFields = [
      "fullName",
      "joiningCourse",
      "batchTime",
      "teacherName",
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6"
    ];

    for (let f of requiredFields) {
      if (!form[f]) {
        alert(`कृपया "${f}" फ़ील्ड भरें`);
        return;
      }
    }

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Duplicate check
    const { data: exist } = await supabase
      .from("feedback")
      .select("*")
      .eq("student_name", form.fullName)
      .eq("feedback_month", month)
      .eq("feedback_year", year);

    if (exist.length > 0) {
      alert(`⚠️ "${form.fullName}" का इस महीने का फीडबैक पहले ही सबमिट हो चुका है!`);
      return;
    }

    // Insert feedback
    const { error } = await supabase.from("feedback").insert([
      {
        student_name: form.fullName,
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
        feedback_month: month,
        feedback_year: year,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("🎉 फीडबैक सफलतापूर्वक सबमिट हो गया!");
      setForm({
        fullName: "",
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
      <div style={styles.card}>
        <h1 style={styles.mainTitle}>PROPER COMPUTER INSTITUTE OF TECHNOLOGIES</h1>
        <h2 style={styles.subTitle}>MONTHLY FEEDBACK FORM</h2>

        <form onSubmit={handleSubmit}>
          {/* STUDENT DETAILS */}
          <h3 style={styles.section}>STUDENT DETAILS</h3>

          <label style={styles.label}>NAME OF STUDENT *</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>JOINING COURSE *</label>
          <input type="text" name="joiningCourse" value={form.joiningCourse} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>BATCH TIME *</label>
          <input type="text" name="batchTime" value={form.batchTime} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>TEACHER NAME *</label>
          <input type="text" name="teacherName" value={form.teacherName} onChange={handleChange} style={styles.input} />

          <h3 style={styles.section}>QUESTION :-</h3>

          {/* Q1 */}
          <p style={styles.q}>1. आपको जो TEACHER पढ़ा रहे हैं उनका BEHAVIOUR आपके साथ कैसा है?</p>
          {render3("q1", form, handleChange)}

          {/* Q2 */}
          <p style={styles.q}>2. यदि आप Application लेकर या टीचर को बताकर CLASS से ABSENT होते हों तो, TEACHER आपका छुटा हुआ COURSE REPEAT कराते हैं क्या?</p>
          {render2("q2", form, handleChange)}

          {/* Q3 */}
          <p style={styles.q}>3. आपकी TEACHER का समझाने का तरीका आपको कैसा लगता है?</p>
          {render3("q3", form, handleChange)}

          {/* Q4 */}
          <p style={styles.q}>4. क्या आप जो TEACHER पढ़ा रहा है, उससे आप संतुष्ट हो क्या?</p>
          {render2("q4", form, handleChange)}

          {/* Q5 */}
          <p style={styles.q}>5. जो आप COMPUTER इस्तेमाल करते हो वह बराबर काम करते हैं या नहीं?</p>
          {render2("q5", form, handleChange)}

          {/* Q6 */}
          <p style={styles.q}>6. क्या आप CLASS में साफ सफाई से संतुष्ट हो या नहीं?</p>
          {render2("q6", form, handleChange)}

          {/* Suggestion */}
          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea name="suggestion" value={form.suggestion} onChange={handleChange} style={styles.textarea}></textarea>

          <button type="submit" style={styles.btn}>सबमिट करें</button>
        </form>
      </div>
    </div>
  );
}

/* Render Options */
function render2(name, form, handleChange) {
  return (
    <div style={styles.row}>
      <label><input type="radio" name={name} value="YES" checked={form[name] === "YES"} onChange={handleChange} /> YES</label>
      <label><input type="radio" name={name} value="NO" checked={form[name] === "NO"} onChange={handleChange} /> NO</label>
    </div>
  );
}

function render3(name, form, handleChange) {
  return (
    <div style={styles.row}>
      <label><input type="radio" name={name} value="BAD" checked={form[name] === "BAD"} onChange={handleChange} /> BAD</label>
      <label><input type="radio" name={name} value="GOOD" checked={form[name] === "GOOD"} onChange={handleChange} /> GOOD</label>
      <label><input type="radio" name={name} value="GREAT" checked={form[name] === "GREAT"} onChange={handleChange} /> GREAT</label>
    </div>
  );
}

const styles = {
  page: { padding: 30, display: "flex", justifyContent: "center", background: "#f3f3f3" },
  card: { background: "white", padding: 30, width: "65%", borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  mainTitle: { textAlign: "center", fontSize: 24, fontWeight: "bold" },
  subTitle: { textAlign: "center", fontSize: 18, marginBottom: 20 },
  section: { marginTop: 20, fontWeight: "bold", fontSize: 18 },
  label: { display: "block", marginTop: 10, fontWeight: "bold" },
  input: { width: "100%", padding: 10, marginTop: 5, border: "1px solid #ccc", borderRadius: 5 },
  textarea: { width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 5, minHeight: 80 },
  q: { marginTop: 15, fontWeight: "bold" },
  row: { display: "flex", gap: 20, marginTop: 5, marginBottom: 10 },
  btn: { width: "100%", padding: 15, background: "blue", color: "white", border: "none", borderRadius: 5, marginTop: 20, fontSize: 18 }
};
