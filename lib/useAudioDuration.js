"use client";

import { useState, useEffect } from "react";

export function useAudioDuration(audioLink) {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!audioLink) return;

    const audio = new Audio(audioLink);
    function handleLoadedMetadata() {
      setDuration(audio.duration);
    }
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioLink]);

  return duration;
}