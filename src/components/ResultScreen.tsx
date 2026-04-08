import { useState } from "react";
import type { Battle, SpeakerId } from "../types/battle";
import type { Translations } from "../data/i18n";
import PixelButton from "./PixelButton";

interface ResultScreenProps {
  battle: Battle;
  onRestart: () => void;
  t: Translations;
}

export default function ResultScreen({ battle, onRestart, t }: ResultScreenProps) {
  const [voted, setVoted] = useState<SpeakerId | null>(null);
  const [voteSubmitting, setVoteSubmitting] = useState(false);

  const winner = battle.fighters.find((f) => f.id === battle.judge.winner)!;
  const winnerPortrait = battle.judge.winner === "a" ? "/images/player_1.png" : "/images/player_2.png";

  async function handleVote(choice: SpeakerId) {
    if (voted || voteSubmitting) return;
    setVoteSubmitting(true);
    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: battle.topic,
          winner: battle.judge.winner,
          userVote: choice,
        }),
      });
    } catch {
      // voting is non-critical
    }
    setVoted(choice);
    setVoteSubmitting(false);
  }

  return (
    <div className="result-screen">
      <div className="screen-bg" />
      <div className="result-overlay" />

      <div className="result-content">
        <div className="result-winner-card">
          <img src={winnerPortrait} alt={winner.name} />
          <p className={`result-winner-name result-winner-name--${battle.judge.winner}`}>
            {t.winner}: {winner.name}
          </p>
          <p className="result-reason">{battle.judge.reason}</p>
        </div>

        <div className="result-vote-section">
          <p className="result-vote-label">{t.whoWon}</p>
          <div className="result-vote-buttons">
            <PixelButton
              label={`${t.vote} ${battle.fighters[0].name}`}
              onClick={() => handleVote("a")}
              variant="red"
              disabled={voted !== null || voteSubmitting}
            />
            <PixelButton
              label={`${t.vote} ${battle.fighters[1].name}`}
              onClick={() => handleVote("b")}
              variant="blue"
              disabled={voted !== null || voteSubmitting}
            />
          </div>
          {voted && (
            <p className="result-voted-msg">
              {t.votedFor} {battle.fighters.find((f) => f.id === voted)?.name}!
            </p>
          )}
        </div>

        <div className="result-actions">
          <PixelButton label={t.rematch} onClick={onRestart} size="lg" />
        </div>
      </div>
    </div>
  );
}
