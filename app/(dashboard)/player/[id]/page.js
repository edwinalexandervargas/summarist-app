"use client";

import { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaUndo, FaRedo } from "react-icons/fa";

export default function PlayerPage({ params }) {
  const { id } = use(params);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

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

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function skip(seconds) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      duration,
    );
  }

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div className="player__wrapper">
      <div className="player__content">
        <h1 className="player__title">{book.title}</h1>
        <p className="player__summary">
          {book.summary.split("\n\n").map((paragraph, i) => (
            <span key={i} className="player__paragraph">
              {paragraph.trim()}
            </span>
          ))}
        </p>
      </div>

      <div className="player__bar">
        <div className="player__bar-book">
          <img
            src={book.imageLink}
            alt={book.title}
            className="player__bar-image"
          />
          <div className="player__bar-meta">
            <p className="player__bar-title">{book.title}</p>
            <p className="player__bar-author">{book.author}</p>
          </div>
        </div>

        <div className="player__bar-controls">
          <button className="player__control-btn" onClick={() => skip(-10)}>
            <FaUndo /> 10
          </button>
          <button className="player__play-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="player__control-btn" onClick={() => skip(10)}>
            <FaRedo /> 10
          </button>
        </div>

        <div className="player__bar-progress">
          <span className="player__time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="player__seek"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
          />
          <span className="player__time">{formatTime(duration)}</span>
        </div>

        <audio
          ref={audioRef}
          src={book.audioLink}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}