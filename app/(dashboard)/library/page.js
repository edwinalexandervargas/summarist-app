"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import BookCard from "../../components/BookCard";
import Skeleton from "../../components/Skeleton";

export default function LibraryPage() {
  const user = useSelector((state) => state.auth.user);
  const [savedBooks, setSavedBooks] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLibrary() {
      if (!user) {
        setSavedBooks([]);
        setFinishedBooks([]);
        setLoading(false);
        return;
      }
      try {
        const libraryRef = collection(db, "users", user.uid, "library");
        const savedQuery = query(libraryRef, where("saved", "==", true));
        const finishedQuery = query(libraryRef, where("finished", "==", true));

        const [savedSnap, finishedSnap] = await Promise.all([
          getDocs(savedQuery),
          getDocs(finishedQuery),
        ]);

        setSavedBooks(savedSnap.docs.map((doc) => doc.data()));
        setFinishedBooks(finishedSnap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.log("Error fetching library:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [user]);

  function renderSkeletonGrid(count = 4) {
    return (
      <div className="library__grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="book-card">
            <Skeleton width="100%" height="180px" borderRadius="4px" />
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="80%" height="16px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: "8px" }}>
              <Skeleton width="50%" height="13px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: "8px" }}>
              <Skeleton width="65%" height="13px" borderRadius="4px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="library__wrapper">
      <section className="library__section">
        <h2 className="library__section-title">Saved Books</h2>
        <p className="library__section-count">
          {loading ? "" : `${savedBooks.length} items`}
        </p>
        {loading ? (
          renderSkeletonGrid()
        ) : savedBooks.length === 0 ? (
          <p className="library__empty">No saved books yet.</p>
        ) : (
          <div className="library__grid">
            {savedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <section className="library__section">
        <h2 className="library__section-title">Finished</h2>
        <p className="library__section-count">
          {loading ? "" : `${finishedBooks.length} items`}
        </p>
        {loading ? (
          renderSkeletonGrid()
        ) : finishedBooks.length === 0 ? (
          <p className="library__empty">No finished books yet.</p>
        ) : (
          <div className="library__grid">
            {finishedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
