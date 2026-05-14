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
  <div className="main-container">

    <h2 className="login-title">
      🔐 Login
    </h2>

    {/* ROLE SELECT */}
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "25px",
      }}
    >

      {/* KIRANA */}
      <div
        onClick={() =>
          setForm({
            ...form,
            role: "kirana",
          })
        }
        style={{
          flex: 1,
          padding: "20px",
          borderRadius: "18px",
          cursor: "pointer",

          border:
            form.role === "kirana"
              ? "2px solid #14B8A6"
              : "1px solid rgba(255,255,255,0.08)",

          background:
            form.role === "kirana"
              ? "rgba(20,184,166,0.15)"
              : "rgba(255,255,255,0.03)",

          textAlign: "center",

          boxShadow:
            form.role === "kirana"
              ? "0 0 30px rgba(20,184,166,0.2)"
              : "none",
        }}
      >
        <div
          style={{
            fontSize: "2.2rem",
            marginBottom: "10px",
          }}
        >
          🏪
        </div>

        <h3
          style={{
            color: "white",
            marginBottom: "8px",
          }}
        >
          Kirana Owner
        </h3>

        <p
          style={{
            fontSize: "0.9rem",
          }}
        >
          List and manage warehouse
          spaces
        </p>
      </div>

      {/* ECOM */}
      <div
        onClick={() =>
          setForm({
            ...form,
            role: "ecom",
          })
        }
        style={{
          flex: 1,
          padding: "20px",
          borderRadius: "18px",
          cursor: "pointer",

          border:
            form.role === "ecom"
              ? "2px solid #14B8A6"
              : "1px solid rgba(255,255,255,0.08)",

          background:
            form.role === "ecom"
              ? "rgba(20,184,166,0.15)"
              : "rgba(255,255,255,0.03)",

          textAlign: "center",

          boxShadow:
            form.role === "ecom"
              ? "0 0 30px rgba(20,184,166,0.2)"
              : "none",
        }}
      >
        <div
          style={{
            fontSize: "2.2rem",
            marginBottom: "10px",
          }}
        >
          📦
        </div>

        <h3
          style={{
            color: "white",
            marginBottom: "8px",
          }}
        >
          E-Commerce
        </h3>

        <p
          style={{
            fontSize: "0.9rem",
          }}
        >
          Find and book warehouse
          spaces
        </p>
      </div>
    </div>

    {/* LOGIN FORM */}
    <div className="login-form">

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <button
        className="btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  </div>
);
}