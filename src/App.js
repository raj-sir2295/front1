import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MonthlyFeedbackForm() {
  const [form, setForm] = useState({
    studentName: "",
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

    const { error } = await supabase.from("feedback").insert([
      {
        student_name: form.studentName,
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
      },
    ]);

    if (error) alert("Error: " + error.message);
    else {
      alert("फीडबैक सफलतापूर्वक सबमिट हुआ!");
      setForm({
        studentName: "",
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
        <h2 style={styles.subHeading}>मासिक फीडबैक फॉर्म</h2>

        <form onSubmit={handleSubmit}>
          <h3 style={styles.sectionTitle}>छात्र विवरण</h3>

          <label style={styles.label}>छात्र का नाम</label>
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>जॉइन किया गया कोर्स</label>
          <input
            name="joiningCourse"
            value={form.joiningCourse}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>बैच टाइम</label>
          <input
            name="batchTime"
            value={form.batchTime}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>शिक्षक का नाम</label>
          <input
            name="teacherName"
            value={form.teacherName}
            onChange={handleChange}
            style={styles.input}
          />

          <h3 style={styles.sectionTitle}>प्रश्न</h3>

          {/* Q1 */}
          <p style={styles.question}>1. शिक्षक का व्यवहार आपके साथ कैसा है?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q1" value="BAD" checked={form.q1==='BAD'} onChange={handleChange}/> खराब</label>
            <label><input type="radio" name="q1" value="GOOD" checked={form.q1==='GOOD'} onChange={handleChange}/> अच्छा</label>
            <label><input type="radio" name="q1" value="GREAT" checked={form.q1==='GREAT'} onChange={handleChange}/> बहुत अच्छा</label>
          </div>

          {/* Q2 */}
          <p style={styles.question}>2. अनुपस्थित होने पर क्या शिक्षक छूटा हुआ कोर्स दोबारा समझाते हैं?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q2" value="YES" checked={form.q2==='YES'} onChange={handleChange}/> हाँ</label>
            <label><input type="radio" name="q2" value="NO" checked={form.q2==='NO'} onChange={handleChange}/> नहीं</label>
          </div>

          {/* Q3 */}
          <p style={styles.question}>3. शिक्षक की समझाने की गुणवत्ता कैसी है?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q3" value="BAD" checked={form.q3==='BAD'} onChange={handleChange}/> खराब</label>
            <label><input type="radio" name="q3" value="GOOD" checked={form.q3==='GOOD'} onChange={handleChange}/> अच्छा</label>
            <label><input type="radio" name="q3" value="GREAT" checked={form.q3==='GREAT'} onChange={handleChange}/> बहुत अच्छा</label>
          </div>

          {/* Q4 */}
          <p style={styles.question}>4. क्या आप शिक्षण से संतुष्ट हैं?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q4" value="YES" checked={form.q4==='YES'} onChange={handleChange}/> हाँ</label>
            <label><input type="radio" name="q4" value="NO" checked={form.q4==='NO'} onChange={handleChange}/> नहीं</label>
          </div>

          {/* Q5 */}
          <p style={styles.question}>5. क्या आपका कंप्यूटर सही से काम कर रहा है?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q5" value="YES" checked={form.q5==='YES'} onChange={handleChange}/> हाँ</label>
            <label><input type="radio" name="q5" value="NO" checked={form.q5==='NO'} onChange={handleChange}/> नहीं</label>
          </div>

          {/* Q6 */}
          <p style={styles.question}>6. क्या आप कक्षा की सफ़ाई से संतुष्ट हैं?</p>
          <div style={styles.radioRow}>
            <label><input type="radio" name="q6" value="YES" checked={form.q6==='YES'} onChange={handleChange}/> हाँ</label>
            <label><input type="radio" name="q6" value="NO" checked={form.q6==='NO'} onChange={handleChange}/> नहीं</label>
          </div>

          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea
            name="suggestion"
            value={form.suggestion}
            onChange={handleChange}
            style={styles.textarea}
          />

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
  sectionTitle: { marginTop: "20px", fontSize: "18px", fontWeight: "bold" },
  label: { marginTop: "10px", fontWeight: "bold" },
  input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "10px" },
  textarea: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "80px" },
  question: { marginTop: "15px", fontWeight: "bold" },
  radioRow: { display: "flex", gap: "20px", marginBottom: "10px" },
  submitBtn: { marginTop: "20px", width: "100%", padding: "15px", background: "blue", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", cursor: "pointer" },
};
