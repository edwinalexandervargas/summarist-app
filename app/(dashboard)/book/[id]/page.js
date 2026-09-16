"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  FaRegBookmark,
  FaBookmark,
  FaBookOpen,
  FaMicrophone,
  FaStar,
  FaRegClock,
  FaRegLightbulb,
} from "react-icons/fa";
import { openModal } from "../../../../store/slices/modalSlice";
import { db } from "../../../../lib/firebase";
import { formatDuration } from "../../../../lib/formatTime";

export default function BookPage({ params }) {
  const { id } = use(params);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inLibrary, setInLibrary] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [duration, setDuration] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await axios.get(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
        );
        setBook(response.data);
      } catch (err) {
        console.log("Error fetching book:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  useEffect(() => {
    async function checkLibrary() {
      if (!user) {
        setInLibrary(false);
        return;
      }
      const libraryRef = doc(db, "users", user.uid, "library", id);
      const snap = await getDoc(libraryRef);
      setInLibrary(snap.exists() && snap.data().saved === true);
    }
    checkLibrary();
  }, [user, id]);

  useEffect(() => {
    if (!book?.audioLink) return;

    const audio = new Audio(book.audioLink);
    function handleLoadedMetadata() {
      setDuration(audio.duration);
    }
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [book]);

  function handlePlayerRedirect() {
    if (!user) {
      dispatch(openModal());
      return;
    }
    router.push(`/player/${id}`);
  }

  async function handleLibraryToggle() {
    if (!user) {
      dispatch(openModal());
      return;
    }
    if (libraryLoading) return; // ignore rapid re-clicks without visually disabling the button
    setLibraryLoading(true);
    const libraryRef = doc(db, "users", user.uid, "library", id);
    try {
      if (inLibrary) {
        await setDoc(libraryRef, { saved: false }, { merge: true });
        setInLibrary(false);
      } else {
        await setDoc(
          libraryRef,
          {
            id,
            title: book.title,
            author: book.author,
            subTitle: book.subTitle,
            imageLink: book.imageLink,
            averageRating: book.averageRating,
            duration,
            saved: true,
          },
          { merge: true },
        );
        setInLibrary(true);
      }
    } catch (err) {
      console.log("Error updating library:", err.message);
    } finally {
      setLibraryLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div className="book-detail__wrapper">
      <figure className="book-detail__image--wrapper">
        <img src={book.imageLink} alt={book.title} />
      </figure>

      <h1 className="book-detail__title">{book.title}</h1>
      <p className="book-detail__author">{book.author}</p>
      <p className="book-detail__subtitle">{book.subTitle}</p>

      <div className="book-detail__stats-wrapper">
        <div className="book-detail__stats">
          <div className="book-detail__stat">
            <FaStar />
            <span>
              {book.averageRating} ({book.totalRating} ratings)
            </span>
          </div>
          <div className="book-detail__stat">
            <FaRegClock />
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        <div className="book-detail__stats">
          <div className="book-detail__stat">
            <FaMicrophone />
            <span>{book.type}</span>
          </div>
          <div className="book-detail__stat">
            <FaRegLightbulb />
            <span>{book.keyIdeas} Key ideas</span>
          </div>
        </div>
      </div>

      <div className="book-detail__actions">
        <button className="btn book-detail__action-btn" onClick={handlePlayerRedirect}>
          <FaBookOpen /> Read
        </button>
        <button className="btn book-detail__action-btn" onClick={handlePlayerRedirect}>
          <FaMicrophone /> Listen
        </button>
      </div>

      <button
        className="book-detail__library-btn"
        onClick={handleLibraryToggle}
      >
        {inLibrary ? <FaBookmark /> : <FaRegBookmark />}
        {inLibrary ? " Remove from My Library" : " Add title to My Library"}
      </button>

      <div className="book-detail__section">
        <h2 className="book-detail__section--title">What's it about?</h2>
        <div className="book-detail__tags">
          {book.tags?.map((tag) => (
            <span key={tag} className="book-detail__tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="book-detail__desc">{book.bookDescription}</p>
      </div>

      <div className="book-detail__section">
        <h2 className="book-detail__section--title">About the author</h2>
        <p className="book-detail__desc">{book.authorDescription}</p>
      </div>
    </div>
  );
}