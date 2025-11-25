import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey =
  "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
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
    if (day < 20 || day > 30) {
      alert(
        "कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।"
      );
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

    // STEP 1: Check mobile number in feedback table (custom alert)
    try {
      const { data: registered, error: regError } = await supabase
        .from("feedback") // ✅ feedback table में check किया
        .select("*")
        .eq("mobile_number", cleanedData.mobileNumber);

      if (regError) throw new Error(regError.message);

      if (!registered || registered.length === 0) {
        alert(
          "यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।"
        );
        return;
      }
    } catch (err) {
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
        alert(
          "डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।"
        );
        return;
      }

      if (existing.length > 0) {
        alert(
          `"${cleanedData.fullName}" इस महीने पहले ही फीडबैक दे चुके हैं।`
        );
        return;
      }
    } catch {
      alert(
        "डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।"
      );
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
      alert(
        `फीडबैक सफलतापूर्वक "${cleanedData.fullName}" के लिए सबमिट हुआ!`
      );
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
        <h2 style={styles.instituteHeading}>
          PROPER COMPUTER INSTITUTE OF TECHNOLOGIES
        </h2>
        <h2 style={styles.heading}>Monthly Feedback Form</h2>
        <p style={styles.warning}>
          कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।
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
            <option value="Lalg
