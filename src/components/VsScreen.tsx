import { useEffect } from "react";
import type { Fighter } from "../types/battle";

interface VsScreenProps {
  fighters: [Fighter, Fighter];
  onComplete: () => void;
}

export default function VsScreen({ fighters, onComplete }: VsScreenProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2400);
    return () => clearTimeout(id);
  }, [onComplete]);

  const [a, b] = fighters;

  return (
    <div className="vs-screen">
      <div className="screen-bg" />
      <div className="vs-overlay" />

      <span className="vs-center-word">VS</span>

      <div className="vs-names">
        <span className="vs-name vs-name--a">{a.name}</span>
        <span className="vs-name vs-name--b">{b.name}</span>
      </div>
    </div>
  );
}
