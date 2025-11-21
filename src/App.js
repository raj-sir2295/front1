import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
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
    q7: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const render3 = (name) => (
    <div>
      <label>
        <input type="radio" name={name} value="GOOD" onChange={handleChange} /> GOOD
      </label>
      <label>
        <input type="radio" name={name} value="BETTER" onChange={handleChange} /> BETTER
      </label>
      <label>
        <input type="radio" name={name} value="BEST" onChange={handleChange} /> BEST
      </label>
    </div>
  );

  const render2 = (name) => (
    <div>
      <label>
        <input type="radio" name={name} value="YES" onChange={handleChange} /> YES
      </label>
      <label>
        <input type="radio" name={name} value="NO" onChange={handleChange} /> NO
      </label>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("feedback").insert([form]);

    if (error) {
      alert("Duplicate Entry! Pehle hi feedback submit ho chuka hai.");
      return;
    }

    alert("Feedback Successfully Submitted!");
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
      q7: "",
      suggestion: "",
    });
  };

  const styles = {
    page: { display: "flex", justifyContent: "center", padding: 20 },
    card: { width: "90%", maxWidth: 600, background: "#fff", padding: 20, borderRadius: 10 },
    mainTitle: { textAlign: "center", fontWeight: "bold", fontSize: 22 },
    subTitle: { textAlign: "center", marginBottom: 20 },
    section: { marginTop: 20, fontWeight: "bold" },
    label: { marginTop: 10, display: "block", fontWeight: "bold" },
    input: { width: "100%", padding: 8, borderRadius: 5, border: "1px solid #ccc", marginBottom: 10 },
    textarea: { width: "100%", height: 80, padding: 8, borderRadius: 5, border: "1px solid #ccc" },
    q: { marginTop: 10 },
    btn: {
      width: "100%",
      padding: 12,
      marginTop: 20,
      background: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      fontSize: 16,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.mainTitle}>PROPER COMPUTER INSTITUTE OF TECHNOLOGIES</h1>
        <h2 style={styles.subTitle}>MONTHLY FEEDBACK FORM</h2>

        <form onSubmit={handleSubmit}>
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

          <p style={styles.q}>1. TEACHER ka behaviour kaisa hai?</p>
          {render3("q1")}

          <p style={styles.q}>2. Absent hone par course repeat karate hain?</p>
          {render2("q2")}

          <p style={styles.q}>3. Teacher ka samjhane ka tarika kaisa hai?</p>
          {render3("q3")}

          <p style={styles.q}>4. Kya aap teacher se satisfied ho?</p>
          {render2("q4")}

          <p style={styles.q}>5. Computer sahi kaam karte hain?</p>
          {render2("q5")}

          <p style={styles.q}>6. Class me safai sahi hai?</p>
          {render2("q6")}

          <p style={styles.q}>7. Kya aapko koi problem face hoti hai?</p>
          {render2("q7")}

          <label style={styles.label}>ANY SUGGESTION</label>
          <textarea name="suggestion" value={form.suggestion} onChange={handleChange} style={styles.textarea}></textarea>

          <button type="submit" style={styles.btn}>सबमिट करें</button>
        </form>
      </div>
    </div>
  );
}
