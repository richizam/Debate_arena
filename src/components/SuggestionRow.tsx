import { useEffect, useState } from "react";
import type { Language } from "../types/battle";
import { loadSuggestions, type SuggestedBattle } from "../utils/suggestions";

interface SuggestionRowProps {
  language: Language;
  liveLabel: string;
  heading: string;
  disabled?: boolean;
  onPick: (battle: SuggestedBattle) => void;
}

export default function SuggestionRow({
  language,
  liveLabel,
  heading,
  disabled,
  onPick,
}: SuggestionRowProps) {
  const [battles, setBattles] = useState<SuggestedBattle[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadSuggestions(language).then((next) => {
      if (!cancelled) {
        setBattles(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  if (battles.length === 0) {
    return null;
  }

  return (
    <div className="suggestion-row">
      <p className="suggestion-row__heading">{heading}</p>
      <div className="suggestion-row__track">
        {battles.map((battle) => (
          <button
            key={battle.id}
            type="button"
            className={`suggestion-card${battle.isLive ? " suggestion-card--live" : ""}`}
            onClick={() => onPick(battle)}
            disabled={disabled}
            title={battle.topic}
          >
            <span className="suggestion-card__matchup">
              <span className="suggestion-card__fighter suggestion-card__fighter--a">
                {battle.fighterA}
              </span>
              <span className="suggestion-card__vs">VS</span>
              <span className="suggestion-card__fighter suggestion-card__fighter--b">
                {battle.fighterB}
              </span>
            </span>
            <span className="suggestion-card__topic">{battle.topic}</span>
            {battle.isLive ? <span className="suggestion-card__pip">{liveLabel}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
