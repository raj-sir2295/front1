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

    const today = new Date();
    const day = today.getDate();
    if (day < 20 || day > 30) {
      alert(
        "कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।"
      );
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

    // Clean text
    const clean = (v) => (v ? v.toString().trim().toLowerCase() : "");

    const cleanedData = {
      fullName: clean(form.fullName),
      mobileNumber: form.mobileNumber.trim(),
      branch: clean(form.branch),
      joiningCourse: clean(form.joiningCourse),
      batchTime: clean(form.batchTime),
      teacherName: clean(form.teacherName),
      q1: form.q1.trim().toLowerCase(),
      q2: form.q2.trim().toLowerCase(),
      q3: form.q3.trim().toLowerCase(),
      q4: form.q4.trim().toLowerCase(),
      q5: form.q5.trim().toLowerCase(),
      q6: form.q6.trim().toLowerCase(),
      suggestion: clean(form.suggestion),
    };

    // STEP 1: Check if mobile number is registered
    try {
      const { data: registered, error: regError } = await supabase
        .from("registered_students")
        .select("*")
        .eq("mobile_number", cleanedData.mobileNumber);

      if (regError || !registered || registered.length === 0) {
        alert(
          "यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।"
        );
        return;
      }
    } catch {
      alert(
        "यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।"
      );
      return;
    }

    // STEP 2: Duplicate check
    try {
      const { data: existing, error: selectError } = await supabase
        .from("feedback")
        .select("*")
        .eq("student_name", cleanedData.fullName)
        .eq("feedback_month", feedbackMonth)
        .eq("feedback_year", feedbackYear);

      if (selectError) {
        alert("डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।");
        return;
      }

      if (existing.length > 0) {
        alert(`"${cleanedData.fullName}" इस महीने पहले ही फीडबैक दे चुके हैं।`);
        return;
      }
    } catch {
      alert("डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।");
      return;
    }

    // STEP 3: Insert feedback
    const { error } = await supabase.from("feedback").insert([
      {
        student_name: cleanedData.fullName,
        mobile_number: cleanedData.mobileNumber,
        branch: cleanedData.branch,
        joining_course: cleanedData.joiningCourse,
        batch_time: cleanedData.batchTime,
        teacher_name: cleanedData.teacherName,
        q1: cleanedData.q1,
        q2: cleanedData.q2,
        q3: cleanedData.q3,
        q4: cleanedData.q4,
        q5: cleanedData.q5,
        q6: cleanedData.q6,
        suggestion: cleanedData.suggestion,
        feedback_month: feedbackMonth,
        feedback_year: feedbackYear,
      },
    ]);

    if (error) {
      alert("कुछ समस्या आई, कृपया बाद में प्रयास करें।");
    } else {
      alert(`फीडबैक सफलतापूर्वक "${cleanedData.fullName}" के लिए सबमिट हुआ!`);
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

  // ✅ Clean JSX using all functions & styles
  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>Monthly Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />

          <label style={styles.label}>Mobile Number</label>
          <input
            style={styles.input}
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
          />

          <label style={styles.label}>Branch</label>
          <input
            style={styles.input}
            name="branch"
            value={form.branch}
            onChange={handleChange}
          />

          <label style={styles.label}>Joining Course</label>
          <input
            style={styles.input}
            name="joiningCourse"
            value={form.joiningCourse}
            onChange={handleChange}
          />

          <label style={styles.label}>Batch Time</label>
          <input
            style={styles.input}
            name="batchTime"
            value={form.batchTime}
            onChange={handleChange}
          />

          <label style={styles.label}>Teacher Name</label>
          <input
            style={styles.input}
            name="teacherName"
            value={form.teacherName}
            onChange={handleChange}
          />

          {/* Questions q1 - q6 */}
          {["q1", "q2", "q3", "q4", "q5", "q6"].map((q) => (
            <div key={q}>
              <label style={styles.label}>{q.toUpperCase()}</label>
              <input
                style={styles.input}
                name={q}
                value={form[q]}
                onChange={handleChange}
              />
            </div>
          ))}

          <label style={styles.label}>Suggestion</label>
          <textarea
            style={styles.textarea}
            name="suggestion"
            value={form.suggestion}
            onChange={handleChange}
          />

          <button type="submit" style={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    background: "#f7f7f7",
    padding: "20px",
    minHeight: "100vh",
  },
  formCard: {
    background: "white",
    padding: "25px",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  heading: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
};
