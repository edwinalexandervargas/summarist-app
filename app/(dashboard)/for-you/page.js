"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Skeleton from "../../components/Skeleton";

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          axios.get(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
          ),
          axios.get(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
          ),
          axios.get(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
          ),
        ]);
        setSelectedBook(selectedRes.data[0]);
        setRecommendedBooks(recommendedRes.data);
        setSuggestedBooks(suggestedRes.data);
      } catch (err) {
        console.log("Error fetching books:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  function renderSkeleton() {
    return (
      <div className="for-you__wrapper">
        <Skeleton width="200px" height="24px" />
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "24px",
            marginBottom: "48px",
          }}
        >
          <Skeleton width="140px" height="200px" />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Skeleton width="60%" height="20px" />
            <Skeleton width="40%" height="16px" />
          </div>
        </div>
        <Skeleton width="200px" height="24px" />
        <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Skeleton width="200px" height="250px" />
              <Skeleton width="80%" height="16px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) return renderSkeleton();

  return (
    <div className="for-you__wrapper">
      <div className="for-you__title">Selected just for you</div>

      {selectedBook && (
        <>
          <audio src={selectedBook.audioLink}></audio>
          <Link href={`/book/${selectedBook.id}`} className="selected_book">
            <div className="selected_book--sub-title">
              {selectedBook.subTitle}
            </div>
            <div className="selected_book--line"></div>
            <div className="selected_book--content">
              <figure className="book__image--wrapper">
                <img src={selectedBook.imageLink} alt={selectedBook.title} />
              </figure>
              <div>
                <div className="selected_book--title">{selectedBook.title}</div>
                <div className="selected_book--author">
                  {selectedBook.author}
                </div>
                <button className="selected_book--play-btn">▶</button>
              </div>
            </div>
          </Link>
        </>
      )}

      <div className="for-you__title">Recommended For You</div>
      <div className="for-you__sub-title">We think you'll like these</div>
      <div className="for-you__recommended--books">
        {recommendedBooks.map((book) => (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            className="for-you__recommended--books-link">
            <figure className="book__image--wrapper">
              <img src={book.imageLink} alt={book.title} />
                {book.subscriptionRequired && (
                  <div className="book__pill">Premium</div>
                )}
            </figure>
            <div className="recommended__book--title">{book.title}</div>
            <div className="recommended__book--author">{book.author}</div>
            <div className="recommended__book--sub-title">{book.subTitle}</div>
          </Link>
        ))}
      </div>

      <div className="for-you__title">Suggested Books</div>
      <div className="for-you__sub-title">Browse those books</div>
      <div className="for-you__recommended--books">
        {suggestedBooks.map((book) => (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            className="for-you__recommended--books-link"
          >
            <figure className="book__image--wrapper">
              <img src={book.imageLink} alt={book.title} />
            </figure>
            <div className="recommended__book--title">{book.title}</div>
            <div className="recommended__book--author">{book.author}</div>
            <div className="recommended__book--sub-title">{book.subTitle}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
