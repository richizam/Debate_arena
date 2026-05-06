import { useEffect, useMemo, useRef, useState } from "react";
import type { Battle, Language, SpeakerId } from "../types/battle";
import type { Translations } from "../data/i18n";
import { getApiUrl } from "../utils/api";
import { track } from "../utils/analytics";
import { claimShareBonus } from "../utils/shareBonus";
import PixelButton from "./PixelButton";

interface ResultScreenProps {
  battle: Battle;
  language: Language;
  sharedView: boolean;
  onRestart: () => void;
  t: Translations;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  color: string;
  size: number;
}

interface ShareBattleResponse {
  id: string;
  shareUrl: string;
  matchUrl: string;
}

const CONFETTI_COUNT = 24;
const FALLBACK_SHARE_URL = "https://www.debatearena.xyz";

function buildBattleHash(battle: Battle): string {
  const slug = `${battle.fighters[0].name}|${battle.fighters[1].name}|${battle.topic}|${battle.judge.winner}`;
  return slug.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
}

function buildShareTweet(battle: Battle): string {
  return `${battle.fighters[0].name} vs ${battle.fighters[1].name}: "${battle.topic}". My champion already has a side. Pick yours on Debate Arena.`;
}

function buildConfettiPieces(winner: SpeakerId): ConfettiPiece[] {
  const winnerColor = winner === "a" ? "var(--fighter-a)" : "var(--fighter-b)";
  const otherColor = winner === "a" ? "var(--fighter-b)" : "var(--fighter-a)";
  const palette = [winnerColor, winnerColor, winnerColor, otherColor, "var(--cyan)", "var(--neon-yellow)", "var(--magenta)"];

  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < CONFETTI_COUNT; i += 1) {
    pieces.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: 1.4 + Math.random() * 1.0,
      drift: Math.random() * 60 - 30,
      rotate: Math.random() * 720 - 360,
      color: palette[i % palette.length],
      size: 6 + Math.floor(Math.random() * 6),
    });
  }
  return pieces;
}

export default function ResultScreen({ battle, language, sharedView, onRestart, t }: ResultScreenProps) {
  const [voted, setVoted] = useState<SpeakerId | null>(null);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);
  const [shareData, setShareData] = useState<ShareBattleResponse | null>(null);
  const persistRef = useRef<Promise<ShareBattleResponse | null> | null>(null);

  const winner = battle.fighters.find((f) => f.id === battle.judge.winner)!;
  const winnerPortrait = battle.judge.winner === "a" ? "./images/player_1.png" : "./images/player_2.png";

  const confetti = useMemo(() => buildConfettiPieces(battle.judge.winner), [battle.judge.winner]);
  const battleHash = useMemo(() => buildBattleHash(battle), [battle]);

  useEffect(() => {
    if (sharedView) {
      return;
    }
    if (persistRef.current) {
      return;
    }
    persistRef.current = (async () => {
      try {
        const response = await fetch(getApiUrl("/api/share-battle"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fighters: battle.fighters,
            topic: battle.topic,
            language,
            rounds: battle.rounds,
            verdict: battle.judge,
          }),
        });
        if (!response.ok) {
          return null;
        }
        const data = (await response.json()) as ShareBattleResponse;
        setShareData(data);
        return data;
      } catch {
        return null;
      }
    })();
  }, [battle, language, sharedView]);

  async function handleShare() {
    void track("share_clicked", { surface: "result", judgeWinner: battle.judge.winner });

    const popup = window.open("about:blank", "_blank", "noopener,noreferrer");
    let resolved = shareData;
    if (!resolved && persistRef.current) {
      resolved = await persistRef.current;
    }
    const targetUrl = resolved?.shareUrl ?? FALLBACK_SHARE_URL;
    const tweet = buildShareTweet(battle);
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet
    )}&url=${encodeURIComponent(targetUrl)}`;

    if (popup) {
      try {
        popup.location.href = intent;
      } catch {
        window.open(intent, "_blank", "noopener,noreferrer");
      }
    } else {
      window.open(intent, "_blank", "noopener,noreferrer");
    }

    const claimed = claimShareBonus();
    if (claimed) {
      void track("share_claim_attempted", { surface: "result" });
      void fetch(getApiUrl("/api/share-claim"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ battleHash, surface: "result" }),
        keepalive: true,
      }).catch(() => {
        // audit-only
      });
    }
    setSharedSuccess(true);
  }

  async function handleVote(choice: SpeakerId) {
    if (voted || voteSubmitting) return;
    setVoteSubmitting(true);
    void track("vote", {
      topic: battle.topic.slice(0, 80),
      judgeWinner: battle.judge.winner,
      userVote: choice,
      agrees: choice === battle.judge.winner,
      sharedView,
    });
    try {
      await fetch(getApiUrl("/api/vote"), {
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

  const restartLabel = sharedView ? t.startYourOwnDebate : t.rematch;

  return (
    <div className="result-screen">
      <div className="screen-bg" />
      <div className="result-overlay" />

      <div className="result-confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="result-confetti__piece"
            style={{
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              ["--confetti-drift" as string]: `${piece.drift}px`,
              ["--confetti-rotate" as string]: `${piece.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div className="result-content">
        {sharedView ? (
          <p className="result-shared-banner">{t.sharedViewBanner}</p>
        ) : null}

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
          <PixelButton label={restartLabel} onClick={onRestart} size="lg" />
          <PixelButton label={t.resultShareLabel} onClick={handleShare} variant="red" />
        </div>
        {sharedSuccess ? (
          <p className="result-share-success">{t.resultShareSuccess}</p>
        ) : null}
      </div>
    </div>
  );
}
