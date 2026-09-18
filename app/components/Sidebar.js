"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { openModal } from "../../store/slices/modalSlice";
import { setFontSize } from "../../store/slices/readerSlice";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBookmark,
  FaHighlighter,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const fontSize = useSelector((state) => state.reader.fontSize);
  const dispatch = useDispatch();
  const router = useRouter();
  const isPlayerRoute = pathname.startsWith("/player");

async function handleLogout() {
  await signOut(auth);
  if (pathname !== "/settings") {
    router.push("/");
  }
  onClose?.();
}

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
        <FaTimes />
      </button>
      <div className="sidebar__top">
        <figure className="sidebar__img--mask">
          <img className="sidebar__img" src="/assets/logo.png" alt="logo" />
        </figure>
        <ul className="sidebar__list sidebar__list--top">
          <li
            className={`sidebar__item ${pathname === "/for-you" ? "sidebar__item--active" : ""}`}
          >
            <Link href="/for-you" onClick={onClose}>
              <FaHome /> For You
            </Link>
          </li>
          <li
            className={`sidebar__item ${pathname === "/library" ? "sidebar__item--active" : ""}`}
          >
            <Link href="/library" onClick={onClose}>
              <FaBookmark /> My Library
            </Link>
          </li>
          <li className="sidebar__item sidebar__item--disabled">
            <FaHighlighter /> Highlights
          </li>
          <li className="sidebar__item sidebar__item--disabled">
            <FaSearch /> Search
          </li>
        </ul>

        {isPlayerRoute && (
          <div className="sidebar__font-sizes">
            {["small", "medium", "large", "xlarge"].map((size) => (
              <button
                key={size}
                className={`sidebar__font-btn sidebar__font-btn--${size} ${
                  fontSize === size ? "sidebar__font-btn--active" : ""
                }`}
                onClick={() => dispatch(setFontSize(size))}
                aria-label={`Set text size ${size}`}
              >
                Aa
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className="sidebar__list sidebar__list--bottom">
        <li
          className={`sidebar__item ${pathname === "/settings" ? "sidebar__item--active" : ""}`}
        >
          <Link href="/settings" onClick={onClose}>
            <FaCog /> Settings
          </Link>
        </li>
        <li className="sidebar__item sidebar__item--disabled">
          <FaQuestionCircle /> Help &amp; Support
        </li>
        <li className="sidebar__item">
          {user ? (
            <button onClick={() => handleLogout()}>
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <button onClick={() => dispatch(openModal())}>
              <FaSignOutAlt /> Login
            </button>
          )}
        </li>
      </ul>
    </aside>
  );
}