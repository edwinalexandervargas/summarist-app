"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/store/slices/modalSlice";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AuthModal() {
  const isOpen = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setView("login");
    setEmail("");
    setPassword("");
    setError("");
    setEmailSent(false);
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
      router.push("/for-you");
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

  async function handleGoogleLogin() {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google login:", result.user);
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err) {
      console.log("Google login error:", err.message);
      setError("Something went wrong with Google login. Please try again.");
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
      router.push("/for-you");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  async function handleGuestLogin() {
    try {
      setError("");
      const userLogin = await signInWithEmailAndPassword(
        auth,
        "guest@gmail.com",
        "guest123",
      );
      console.log("Logged in", userLogin.user);
      setEmail("");
      setPassword("");
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err) {
      setError("Guest login is temporarily unavailable. Please try again.");
    }
  }

  async function handlePasswordReset() {
    try {
      setError("");
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (err) {
      console.log("Password reset error code:", err.code);
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setEmailSent(true);
      }
    }
  }

  function renderLoginView() {
    return (
      <>
        <h2 className="auth__title">Log in to Summarist</h2>
        <button
          className="btn modal__guest-btn"
          onClick={() => handleGuestLogin()}
        >
          Login as a Guest
          <FaUser className="modal__guest-icon" />
        </button>
        <div className="auth__separator">
          <span className="auth__separator--text">or</span>
        </div>
        <button
          className="btn modal__google-btn"
          onClick={() => handleGoogleLogin()}
        >
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
        <button
          className="btn modal__google-btn"
          onClick={() => handleGoogleLogin()}
        >
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
        {emailSent ? (
          <p>
            If an account with that email exists, we've sent a password reset
            link.
          </p>
        ) : (
          <>
            <input
              className="auth__main--input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="auth__error">{error}</p>}
            <button className="btn" onClick={() => handlePasswordReset()}>
              Send reset password link
            </button>
          </>
        )}
      </>
    );
  }

  function renderSwitchBar() {
    if (view === "login") {
      return (
        <button
          className="auth__switch--btn"
          onClick={() => {
            setView("register");
            setEmail("");
            setPassword("");
          }}
        >
          Don't have an account?
        </button>
      );
    }
    if (view === "register") {
      return (
        <button
          className="auth__switch--btn"
          onClick={() => {
            setView("login");
            setEmail("");
            setPassword("");
          }}
        >
          Already have an account?
        </button>
      );
    }
    if (view === "password-reset") {
      return (
        <button
          className="auth__switch--btn"
          onClick={() => {
            setView("login");
            setEmailSent(false);
            setEmail("");
            setPassword("");
          }}
        >
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
