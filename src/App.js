https://feedbackformall.netlify.app/

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

  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const day = today.getDate();

    // Check date (1-30)
    if (day < 1 || day > 30) {
      alert(
        "कृपया ध्यान दें: फीडबैक फॉर्म केवल 1 तारीख़ से 30 तारीख़ तक भर सकते हैं।"
      );
      return;
    }

    // Required fields validation
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

    try {
      // -----------------------------
      // ✅ STEP 1: Check mobile number in registered_students
      // -----------------------------
      const { data: registered, error: regError } = await supabase
        .from("registered_students")  // ⭐ NEW TABLE CHECK
        .select("*")
        .eq("mobile_number", cleanedData.mobileNumber);

      if (regError) throw new Error(regError.message);

      if (!registered || registered.length === 0) {
        alert(
          "यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।"
        );
        return;
      }

      // -----------------------------
      // STEP 2: Check duplicate feedback for this month
      // -----------------------------
      const { data: existing, error: selectError } = await supabase
        .from("feedback")
        .select("*")
        .eq("mobile_number", cleanedData.mobileNumber)
        .eq("feedback_month", feedbackMonth)
        .eq("feedback_year", feedbackYear);

      if (selectError) {
        alert("डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।");
        return;
      }

      if (existing.length > 0) {
        alert("इस मोबाइल नंबर से इस महीने पहले ही फीडबैक भेजा जा चुका है।");
        return;
      }

      // -----------------------------
      // STEP 3: Insert feedback
      // -----------------------------
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
    } catch (err) {
      alert(err.message || "कुछ समस्या आई, कृपया बाद में प्रयास करें।");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h2 style={styles.instituteHeading}>
          PROPER COMPUTER INSTITUTE OF TECHNOLOGIES
        </h2>
        <h2 style={styles.heading}>Monthly Feedback Form</h2>
        <p style={styles.warning}>
          कृपया ध्यान दें: फीडबैक फॉर्म केवल 1तारीख़ से 30 तारीख़ तक भर सकते हैं।
        </p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Mobile Number", name: "mobileNumber" },
            { label: "Joining Course", name: "joiningCourse" },
            { label: "Batch Time", name: "batchTime" },
            { label: "Teacher Name", name: "teacherName" },
          ].map((item) => (
            <div key={item.name}>
              <label style={styles.label}>{item.label}</label>
              <input
                style={{
                  ...styles.input,
                  ...(focused === item.name ? styles.inputFocus : {}),
                }}
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                onFocus={() => setFocused(item.name)}
                onBlur={() => setFocused("")}
              />
            </div>
          ))}

          <label style={styles.label}>Branch</label>
          <select
            style={{
              ...styles.input,
              ...(focused === "branch" ? styles.inputFocus : {}),
            }}
            name="branch"
            value={form.branch}
            onChange={handleChange}
            onFocus={() => setFocused("branch")}
            onBlur={() => setFocused("")}
          >
            <option value="">--Select Branch--</option>
            <option value="Lalganj">Lalganj</option>
            <option value="Vaishali Nagar">Vaishali Nagar</option>
          </select>

          {[
            { label: "Q1: Teacher का Behaviour कैसा है?", name: "q1", options: ["bad", "good", "great"] },
            { label: "Q2: Absence पर Course Repeat करवाते हैं?", name: "q2", options: ["yes", "no"] },
            { label: "Q3: Teacher का समझाने का तरीका कैसा है?", name: "q3", options: ["bad", "good", "great"] },
            { label: "Q4: Teacher से संतुष्ट हैं?", name: "q4", options: ["yes", "no"] },
            { label: "Q5: Computer Condition सही है?", name: "q5", options: ["yes", "no"] },
            { label: "Q6: Class में सफाई से संतुष्ट हैं?", name: "q6", options: ["yes", "no"] },
          ].map((q) => (
            <div style={styles.question} key={q.name}>
              <label style={styles.label}>{q.label}</label>
              {q.options.map((opt) => (
                <label style={styles.radioLabel} key={opt}>
                  <input
                    type="radio"
                    name={q.name}
                    value={opt}
                    checked={form[q.name] === opt}
                    onChange={handleChange}
                  />{" "}
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>
          ))}

          <div style={styles.question}>
            <label style={styles.label}>Suggestion</label>
            <textarea
              style={{
                ...styles.textarea,
                ...(focused === "suggestion" ? styles.inputFocus : {}),
              }}
              name="suggestion"
              value={form.suggestion}
              onChange={handleChange}
              onFocus={() => setFocused("suggestion")}
              onBlur={() => setFocused("")}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(hover ? styles.submitBtnHover : {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
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
    alignItems: "center",
    background:
      "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    padding: "20px",
    minHeight: "100vh",
  },
  formCard: {
    background:
      "linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)",
    padding: "25px 35px",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
  instituteHeading: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  heading: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  warning: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  label: { fontWeight: "bold", display: "block", marginBottom: "5px" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    outline: "none",
    transition: "0.3s",
  },
  question: { marginBottom: "20px" },
  radioLabel: { marginRight: "20px", display: "inline-block", marginTop: "5px" },
  submitBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  submitBtnHover: {
    background: "linear-gradient(90deg, #5b86e5 0%, #36d1dc 100%)",
  },
  inputFocus: {
    borderColor: "#36d1dc",
    boxShadow: "0 0 5px rgba(54, 209, 220, 0.5)",
  },
};
