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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const day = today.getDate();

    if (day < 1 || day > 30) {
      alert("फीडबैक फॉर्म केवल 1 से 30 तारीख़ तक भरा जा सकता है।");
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
      "suggestion",
    ];

    for (let field of requiredFields) {
      if (!form[field]) {
        alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
        return;
      }
    }

    if (form.suggestion.trim().length < 5) {
      alert("Suggestion कम से कम 5 अक्षरों का होना चाहिए।");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) {
      alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }

    const feedbackMonth = today.getMonth() + 1;
    const feedbackYear = today.getFullYear();

    const clean = (v) => (v ? v.toString().trim().toLowerCase() : "");

    try {
      const { data: registered } = await supabase
        .from("registered_students")
        .select("*")
        .eq("mobile_number", form.mobileNumber.trim());

      if (!registered || registered.length === 0) {
        alert("यह मोबाइल नंबर registered नहीं है।");
        return;
      }

      const { data: existing } = await supabase
        .from("feedback")
        .select("*")
        .eq("mobile_number", form.mobileNumber.trim())
        .eq("feedback_month", feedbackMonth)
        .eq("feedback_year", feedbackYear);

      if (existing && existing.length > 0) {
        alert("इस महीने का feedback पहले ही दिया जा चुका है।");
        return;
      }

      const { error } = await supabase.from("feedback").insert([
        {
          student_name: clean(form.fullName),
          mobile_number: form.mobileNumber.trim(),
          branch: clean(form.branch),
          joining_course: clean(form.joiningCourse),
          batch_time: clean(form.batchTime),
          teacher_name: clean(form.teacherName),
          q1: clean(form.q1),
          q2: clean(form.q2),
          q3: clean(form.q3),
          q4: clean(form.q4),
          q5: clean(form.q5),
          q6: clean(form.q6),
          suggestion: clean(form.suggestion),
          feedback_month: feedbackMonth,
          feedback_year: feedbackYear,
        },
      ]);

      if (error) {
        alert("कुछ समस्या आई, कृपया बाद में प्रयास करें।");
      } else {
        alert("Feedback सफलतापूर्वक submit हो गया ✅");
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
    } catch {
      alert("Server error, बाद में प्रयास करें।");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>Monthly Feedback Form</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="suggestion"
            placeholder="Suggestion (Required)"
            value={form.suggestion}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
  },
  formCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};
