import { useState } from "react";
import type { Battle, JudgeVerdict } from "../types/battle";
import type { Translations } from "../data/i18n";
import { cn } from "../utils/classNames";
import DialogueBox from "./DialogueBox";
import SpeakerBadge from "./SpeakerBadge";

interface DebateScreenProps {
  battle: Battle;
  onComplete: (verdict: JudgeVerdict) => void;
  abortSignal: AbortSignal;
  t: Translations;
}

export default function DebateScreen({ battle, onComplete, t }: DebateScreenProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [fighterA, fighterB] = battle.fighters;
  const line = battle.rounds[currentLine];
  const activeSpeaker = line.speaker;
  const isLast = currentLine === battle.rounds.length - 1;

  function handleNext() {
    if (isTransitioning) return;
    if (isLast) {
      onComplete(battle.judge);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLine((n) => n + 1);
      setIsTransitioning(false);
    }, 250);
  }

  return (
    <div className="debate-screen" onClick={handleNext}>
      <div className="screen-bg" />
      <div className="debate-overlay" />

      <div className="debate-portraits">
        <div
          className={cn(
            "debate-portrait",
            "speaker-a",
            activeSpeaker === "a" ? "debate-portrait--active" : "debate-portrait--inactive"
          )}
        >
          <img src="/images/player_1.png" alt={fighterA.name} />
          <SpeakerBadge name={fighterA.name} speakerId="a" />
        </div>

        <div
          className={cn(
            "debate-portrait",
            "speaker-b",
            activeSpeaker === "b" ? "debate-portrait--active" : "debate-portrait--inactive"
          )}
        >
          <img src="/images/player_2.png" alt={fighterB.name} />
          <SpeakerBadge name={fighterB.name} speakerId="b" />
        </div>
      </div>

      <div className="debate-bottom" onClick={(e) => e.stopPropagation()}>
        <p className="debate-progress">
          {currentLine + 1} / {battle.rounds.length}
        </p>
        <DialogueBox
          speakerName={activeSpeaker === "a" ? fighterA.name : fighterB.name}
          speakerId={activeSpeaker}
          text={line.text}
          isVisible={!isTransitioning}
        />
        <button className="debate-next-btn" onClick={handleNext}>
          {isLast ? t.judgeVerdictBtn : t.next}
        </button>
      </div>
    </div>
  );
}
