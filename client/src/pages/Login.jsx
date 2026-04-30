import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ store user + token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // 🔥 update React state instantly
      setUser(data.user);

      alert("Login successful!");


      // 🔀 SINGLE redirect (no duplicates)
      if (data.user.role === "kirana") {
        navigate("/");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <button onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>
    </div>
  );
}