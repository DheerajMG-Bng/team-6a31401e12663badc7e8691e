/**
 * AUTH PAGE COMPONENT - HANDLES USER AUTHENTICATION (LOGIN AND REGISTRATION)
 * 
 * Features:
 * - Toggle between Login and Register modes.
 * - Login: Validates credentials.
 * - Register: Collects name, email, password; enforces password length.
 * - Password visibility toggle (show/hide password).
 * - Displays error messages for invalid inputs or mismatched credentials.
 */

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "../styles/AuthPage.css";

const MOCK_USERS = [
  {
    email: "aashu@example.com",
    password: "password123",
    name: "Aashu Goswami",
    handle: "@aashu_goswami",
    avatar: "AG",
    role: "user",
  },
  {
    email: "admin@vins.com",
    password: "admin123",
    name: "VINS Admin",
    handle: "@vins_admin",
    avatar: "VA",
    role: "admin",
  },
];

export default function AuthPage({ onNavigate, onLogin }) {
  // STATE MANAGEMENT
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // EVENT HANDLERS

  // FUNCTION TO HANDLE LOGIN FORM SUBMISSION
  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      onLogin({
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
      });
    } else {
      setError("Invalid email or password.");
    }
  }

  // FUNCTION TO HANDLE REGISTRATION FORM SUBMISSION
  function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // AUTO-GENERATE A HANDLE BASED ON USER'S NAME
    const handle = "@" + name.trim().toLowerCase().replace(/\s+/g, "_");

    // AUTO-GENERATE AN AVATAR - TWO INITAL LETTERS IN UPPERCASE
    const avatar = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    // CALL THE ON LOGIN CALLBACK WITH NEWLY REGISTERED USER
    onLogin({ name: name.trim(), handle, avatar, email, role : "user" });
  }

  // FUNCTION TO SWITCH BETWEEN LOGIN AND REGISTER FORMS
  function switchMode(m) {
    setMode(m);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  }

  // RENDER DOM
  return (
    <div className="auth-page">

      {/* HEADER SECTION WITH BACK BUTTON AND LOGO */}
      
      <header className="auth-page__header">
        <div className="auth-page__header-container">
          
          {/* BACK BUTTON */}

          <button
            onClick={() => onNavigate("home")}
            className="auth-page__back-btn"
          >
            <ArrowLeft className="auth-page__back-icon" />
          </button>

          {/* LOGO OF THE PLATFORM */}

          <span className="auth-page__logo">
            VINS<span className="auth-page__logo-highlight"> FAQ SERVER</span>
          </span>
        </div>
      </header>

      {/* MAIN FORM CONTAINER */}

      <div className="auth-page__main">
        <div className="auth-page__form-container">
          
          {/* MODE TOGGLE BUTTONS - LOGIN OR REGISTER */}
          
          <div className="auth-page__mode-toggle">
            <button
              onClick={() => switchMode("login")}
              className={`auth-page__mode-btn ${
                mode === "login" ? "auth-page__mode-btn--active" : ""
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`auth-page__mode-btn ${
                mode === "register" ? "auth-page__mode-btn--active" : ""
              }`}
            >
              Register
            </button>
          </div>

          {/* HEADING - TEXT CHANGES BASED ON MODE */}

          <div className="auth-page__heading">
            <p className="auth-page__heading-badge">
              {mode === "login" ? "Welcome back" : "Create account"}
            </p>
            <h1 className="auth-page__heading-title">
              {mode === "login" ? "Sign in to continue" : "Join the community"}
            </h1>
          </div>

          {/* AUTHENTICATION FORM - FIELDS DEPEND ON MODE */}

          <form
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className="auth-page__form"
          >

            {/* FULL NAME FIELD - ONLY FOR REGISTER MODE */}

            {mode === "register" && (
              <div className="auth-page__field">
                <label className="auth-page__label">FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Aashu Goswami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-page__input"
                />
              </div>
            )}

            {/* EMAIL FIELD - ALWAYS SHOWN */}

            <div className="auth-page__field">
              <label className="auth-page__label">EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-page__input"
              />
            </div>

            {/* PASSWORD FIELD - WITH SHOW AND HIDE PASSOWRD TOGGLE */}

            <div className="auth-page__field">
              <label className="auth-page__label">PASSWORD</label>
              <div className="auth-page__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-page__input auth-page__input--password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="auth-page__password-toggle"
                >
                  {showPassword ? <EyeOff className="auth-page__password-icon" /> : <Eye className="auth-page__password-icon" />}
                </button>
              </div>
            </div>

            {/* DISPLAY ERROR MESSAGE IF ANY */}

            {error && (
              <p className="auth-page__error">{error}</p>
            )}

            {/* SUBMIT BUTTON - TEXT CAHNGES BASED ON MODE */}

            <button
              type="submit"
              className="auth-page__submit-btn"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* SHOW DEMO CREDENTIALS */}
          
          {mode === "login" && (
            <p className="auth-page__demo-note">
              User: <span className="auth-page__demo-cred">aashu@example.com</span> /{" "}
              <span className="auth-page__demo-cred">password123</span>
              <br />
              Admin: <span className="auth-page__demo-cred">admin@vins.com</span> /{" "}
              <span className="auth-page__demo-cred">admin123</span>
            </p>
          )}

          {/* LINK TO SWITCH BETWEEN LOGIN AND REGISTER */}

          <p className="auth-page__switch-mode">
            {mode === "login" ? "No account? " : "Already have one? "}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="auth-page__switch-link"
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}