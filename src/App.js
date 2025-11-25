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
      alert("कृपया ध्यान दें: फीडबैक फॉर्म केवल 20 तारीख़ से 30 तारीख़ तक भर सकते हैं।");
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

    // ⭐ STEP 1: Check if mobile number is registered
    let registered, regError;

    try {
      const result = await supabase
        .from("registered_students")
        .select("*")
        .eq("mobile_number", cleanedData.mobileNumber);

      registered = result.data;
      regError = result.error;
    } catch (err) {
      regError = err;
    }

    // ⭐ always show your message (no Supabase error to user)
    if (regError) {
      alert("यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।");
      return;
    }

    if (!registered || registered.length === 0) {
      alert("यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।");
      return;
    }

    // ⭐ STEP 2: Duplicate check
    let existing, selectError;
    try {
      const result2 = await supabase
        .from("feedback")
        .select("*")
        .eq("student_name", cleanedData.fullName)
        .eq("feedback_month", feedbackMonth)
        .eq("feedback_year", feedbackYear);

      existing = result2.data;
      selectError = result2.error;
    } catch (err) {
      selectError = err;
    }

    if (selectError) {
      alert("डुप्लिकेट चेक करते समय समस्या आई, कृपया बाद में प्रयास करें।");
      return;
    }

    if (existing.length > 0) {
      alert(`"${cleanedData.fullName}" इस महीने पहले ही फीडबैक दे चुके हैं.`);
      return;
    }

    // ⭐ STEP 3: INSERT FEEDBACK
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

  return (
    <div>
      {/* FORM JSX (same as you already have) */}
      {/* आपने ऊपर जो UI/QUESTIONS वाली code दी थी, वो same ही रहेगी */}
    </div>
  );
}
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    background: "#f7f7f7",
    padding: "20px",
    minHeight: "100vh"
  },

  formCard: {
    background: "white",
    padding: "25px",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)"
  },

  heading: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "5px"
  },

  subHeading: {
    textAlign: "center",
    fontSize: "18px",
    marginBottom: "10px"
  },

  infoLabel: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px"
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px"
  },

  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  question: {
    fontWeight: "bold",
    marginTop: "10px"
  },

  radioRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    marginTop: "5px"
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px"
  },

  tip: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "10px"
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
    fontSize: "16px"
  }
};
