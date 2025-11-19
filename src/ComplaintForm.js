import React, { useState } from "react";
import axios from "axios";

function ComplaintForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    student_id: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/submit", form);

    alert(res.data.message);
  };

  return (
    <div style={{ width: "50%", margin: "auto", padding: 20 }}>
      <h2>Student Feedback  Form</h2>

      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Student ID:</label>
        <input
          type="text"
          name="student_id"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Feedback about Teaching and teacher:</label>
        <textarea
          name="description"
          onChange={handleChange}
          required
          rows="4"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        ></textarea>

        <button
          type="submit"
          style={{
            padding: 10,
            width: "100%",
            background: "blue",
            color: "white",
            fontSize: 16,
          }}
        >
          Submit Your Feedback
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
