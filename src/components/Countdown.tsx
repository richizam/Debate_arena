import { useEffect, useState } from "react";

interface CountdownProps {
  className?: string;
}

function nextLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime();
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => part.toString().padStart(2, "0")).join(":");
}

export default function Countdown({ className }: CountdownProps) {
  const [target, setTarget] = useState<number>(() => nextLocalMidnight());
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= target) {
        setTarget(nextLocalMidnight());
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span className={className}>{formatRemaining(target - now)}</span>;
}
