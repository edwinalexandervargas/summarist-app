"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBookmark, FaHighlighter, FaSearch, FaCog, FaQuestionCircle } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <figure className="sidebar__img--mask">
          <img className="sidebar__img" src="/assets/logo.png" alt="logo" />
        </figure>
        <ul className="sidebar__list sidebar__list--top">
          <li className={`sidebar__item ${pathname === "/for-you" ? "sidebar__item--active" : ""}`}>
            <Link href="/for-you">
              <FaHome /> For You
            </Link>
          </li>
          <li className={`sidebar__item ${pathname === "/library" ? "sidebar__item--active" : ""}`}>
            <Link href="/library">
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
      </div>
      <ul className="sidebar__list sidebar__list--bottom">
        <li className={`sidebar__item ${pathname === "/settings" ? "sidebar__item--active" : ""}`}>
          <Link href="/settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li className="sidebar__item sidebar__item--disabled">
          <FaQuestionCircle /> Help &amp; Support
        </li>
        <li className="sidebar__item">Login</li>
      </ul>
    </aside>
  );
}