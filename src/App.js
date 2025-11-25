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

    // ✅ Clean all text fields: trim + lowercase
    const clean = (value) => (value ? value.toString().trim().toLowerCase() : "");
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

    // Step 1: Check if mobile number is registered
    const { data: registered, error: regError } = await supabase
      .from("registered_students")
      .select("*")
      .eq("mobile_number", cleanedData.mobileNumber);

    if (regError) {
      alert("Error checking mobile number: " + regError.message);
      return;
    }

    if (!registered || registered.length === 0) {
      alert(
        "यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं है! केवल registered mobile number से ही feedback दिया जा सकता है।"
      );
      return;
    }

    // Step 2: Duplicate check
    const { data: existing, error: selectError } = await supabase
      .from("feedback")
      .select("*")
      .eq("student_name", cleanedData.fullName)
      .eq("feedback_month", feedbackMonth)
      .eq("feedback_year", feedbackYear);

    if (selectError) {
      alert("Error checking duplicates: " + selectError.message);
      return;
    }

    if (existing.length > 0) {
      alert(
        `Duplicate entry! "${cleanedData.fullName}" के लिए फीडबैक इस महीने पहले ही सबमिट हो चुका है।`
      );
      return;
    }

    // Step 3: Insert feedback
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
      alert("Error: " + error.message);
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

  const questions = [
    "आपका जो TEACHER पढ़ा रहे हैं उसका BEHAVIOUR आपके साथ कैसा है?",
    "यदि आप आवेदन देकर या Teacher को बता कर Classes से absent होते हैं,तो क्या Teacher आपको छूटा हुआ कोर्स Repeat करवाते हैं या नहीं?",
    "आपकी TEACHER का समझाने का तरीका कैसा है?",
    "क्या आप अपने उन Teacher से संतुष्ट हैं जो आपको पढ़ा रहे हैं?",
    "जो आप COMPUTER इस्तेमाल करते हैं उसका CONDITION अच्छा है या नहीं?",
    "क्या आप class में साफ़–सफ़ाई से संतुष्ट हैं? ",
  ];

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
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>MOBILE NUMBER *</label>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>BRANCH *</label>
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">--Select Branch--</option>
            <option value="Lalganj">Lalganj</option>
            <option value="Vaishali Nagar">Vaishali Nagar</option>
          </select>

          <label style={styles.label}>JOINING COURSE *</label>
          <input
            name="joiningCourse"
            value={form.joiningCourse}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>BATCH TIME *</label>
          <input
            name="batchTime"
            value={form.batchTime}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>TEACHER NAME *</label>
          <input
            name="teacherName"
            value={form.teacherName}
            onChange={handleChange}
            style={styles.input}
          />

          <h3 style={styles.sectionTitle}>प्रश्न</h3>

          {questions.map((text, i) => (
            <div key={i}>
              <p style={styles.question}>
                {i + 1}. {text}
              </p>
              {i === 0 || i === 2 ? (
                <div style={styles.radioRow}>
                  <label>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value="bad"
                      checked={form[`q${i + 1}`] === "bad"}
                      onChange={handleChange}
                    />{" "}
                    BAD
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value="good"
                      checked={form[`q${i + 1}`] === "good"}
                      onChange={handleChange}
                    />{" "}
                    GOOD
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value="great"
                      checked={form[`q${i + 1}`] === "great"}
                      onChange={handleChange}
                    />{" "}
                    GREAT
                  </label>
                </div>
              ) : (
                <div style={styles.radioRow}>
                  <label>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value="yes"
                      checked={form[`q${i + 1}`] === "yes"}
                      onChange={handleChange}
                    />{" "}
                    YES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value="no"
                      checked={form[`q${i + 1}`] === "no"}
                      onChange={handleChange}
                    />{" "}
                    NO
                  </label>
                </div>
              )}
            </div>
          ))}

          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea
            name="suggestion"
            value={form.suggestion}
            onChange={handleChange}
            style={styles.textarea}
          />
          <p style={styles.tip}>टिप: कृपया सभी फ़ील्ड भरें।</p>

          <button type="submit" style={styles.submitBtn}>
            सबमिट करें
          </button>
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
 sectionTitle: { marginTop: "20px", fontWeight: "bold" },
