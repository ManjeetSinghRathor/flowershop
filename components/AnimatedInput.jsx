import { useEffect, useState } from "react";

const WORDS = ["bouquets", "cakes", "plants", "subscriptions"];

export default function AnimatedFakeInput() {
  const BASE_TEXT = "Search for ";
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState(BASE_TEXT);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeout;

    if (!isDeleting) {
      // Typing
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
          setText(BASE_TEXT + currentWord.slice(0, charIndex + 1));
        }, 90);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => setIsDeleting(true), 1200);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
          setText(BASE_TEXT + currentWord.slice(0, charIndex - 1));
        }, 50);
      } else {
        // Move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className="flex-1 text-left text-black/50 select-none whitespace-nowrap">
      {text}
      <span className="ml-0.5 animate-pulse">|</span>
    </div>
  );
}
