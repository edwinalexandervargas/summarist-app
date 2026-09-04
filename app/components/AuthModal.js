"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/store/slices/modalSlice";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthModal() {
  const isOpen = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView("login");
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleRegister() {
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Registered", userCredential.user);
      setEmail("");
      setPassword("");
      dispatch(closeModal());
    } catch (err) {
      if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  async function handleLogin() {
    try {
      setError("");
      const userLogin = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in", userLogin.user);
      setEmail("");
      setPassword("");
      dispatch(closeModal());
    } catch (err) {
      console.log("Login error code:", err.code);
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  function renderLoginView() {
    return (
      <>
        <h2 className="auth__title">Log in to Summarist</h2>
        <button className="btn modal__guest-btn">
          Login as a Guest
          <FaUser className="modal__guest-icon" />
        </button>
        <div className="auth__separator">
          <span className="auth__separator--text">or</span>
        </div>
        <button className="btn modal__google-btn">
          Login with Google
          <FcGoogle className="modal__google-icon" />
        </button>
        <div className="auth__separator">
          <span className="auth__separator--text">or</span>
        </div>
        <input
          className="auth__main--input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth__main--input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth__error">{error}</p>}
        <button className="btn" onClick={() => handleLogin()}>
          Login
        </button>
        <p
          className="auth__forgot--password"
          onClick={() => setView("password-reset")}
        >
          Forgot your password?
        </p>
      </>
    );
  }

  function renderRegisterView() {
    return (
      <>
        <h2 className="auth__title">Sign up to Summarist</h2>
        <button className="btn modal__google-btn">
          Login with Google
          <FcGoogle className="modal__google-icon" />
        </button>
        <div className="auth__separator">
          <span className="auth__separator--text">or</span>
        </div>
        <input
          className="auth__main--input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth__main--input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth__error">{error}</p>}
        <button className="btn" onClick={() => handleRegister()}>
          Register
        </button>
      </>
    );
  }

  function renderPasswordResetView() {
    return (
      <>
        <h2 className="auth__title">Reset your password</h2>
        <input
          className="auth__main--input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn">Send reset password link</button>
      </>
    );
  }

  function renderSwitchBar() {
    if (view === "login") {
      return (
        <button
          className="auth__switch--btn"
          onClick={() => setView("register")}
        >
          Don't have an account?
        </button>
      );
    }
    if (view === "register") {
      return (
        <button className="auth__switch--btn" onClick={() => setView("login")}>
          Already have an account?
        </button>
      );
    }
    if (view === "password-reset") {
      return (
        <button className="auth__switch--btn" onClick={() => setView("login")}>
          Go to login
        </button>
      );
    }
  }

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={() => dispatch(closeModal())}>
          X
        </button>
        <div className="auth__content">
          {view === "login" && renderLoginView()}
          {view === "register" && renderRegisterView()}
          {view === "password-reset" && renderPasswordResetView()}
        </div>
        {renderSwitchBar()}
      </div>
    </div>
  );
}
