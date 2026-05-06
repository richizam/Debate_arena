import { useEffect, useRef, useState } from "react";
import type { SpeakerId } from "../types/battle";
import SpeakerBadge from "./SpeakerBadge";
import { cn } from "../utils/classNames";

interface DialogueBoxProps {
  speakerName: string;
  speakerId: SpeakerId;
  text: string;
  isVisible: boolean;
}

const CHARS_PER_SECOND = 40;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function DialogueBox({ speakerName, speakerId, text, isVisible }: DialogueBoxProps) {
  const [displayed, setDisplayed] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (prefersReducedMotion()) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");
    const start = performance.now();

    function step(now: number) {
      const elapsedSec = (now - start) / 1000;
      const nextLength = Math.min(text.length, Math.floor(elapsedSec * CHARS_PER_SECOND));
      setDisplayed(text.slice(0, nextLength));
      if (nextLength < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text]);

  function skipTypewriter() {
    if (displayed === text) {
      return;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDisplayed(text);
  }

  const isComplete = displayed === text;

  return (
    <div
      className={cn("dialogue-box", !isVisible && "hidden", !isComplete && "dialogue-box--typing")}
      onClick={skipTypewriter}
    >
      <div className="dialogue-box-speaker">
        <SpeakerBadge name={speakerName} speakerId={speakerId} />
      </div>
      <p className="dialogue-box-text">
        {displayed}
        {!isComplete ? <span className="dialogue-box-caret" aria-hidden="true">|</span> : null}
      </p>
    </div>
  );
}
