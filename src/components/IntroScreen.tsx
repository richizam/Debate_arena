import { useEffect, useRef, useState } from "react";
import type { Language, Tone } from "../types/battle";
import { LANGUAGES, translations } from "../data/i18n";
import { track } from "../utils/analytics";
import type { SuggestedBattle } from "../utils/suggestions";
import Flag from "./Flag";
import PixelButton from "./PixelButton";
import SuggestionRow from "./SuggestionRow";
import TonePicker from "./TonePicker";

const TONE_STORAGE_KEY = "debate_arena_tone";

function loadStoredTone(): Tone {
  try {
    const stored = localStorage.getItem(TONE_STORAGE_KEY);
    if (stored === "civil" || stored === "heated" || stored === "savage") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable; silently fall back
  }
  return "heated";
}

function persistTone(tone: Tone) {
  try {
    localStorage.setItem(TONE_STORAGE_KEY, tone);
  } catch {
    // ignore
  }
}

interface IntroScreenProps {
  onStart: (
    player1: string,
    player2: string,
    topic: string,
    language: Language,
    liveContext: boolean,
    tone: Tone
  ) => void;
  isLoading: boolean;
}

export default function IntroScreen({ onStart, isLoading }: IntroScreenProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>(loadStoredTone);
  const [activeSuggestion, setActiveSuggestion] = useState<SuggestedBattle | null>(null);
  const shownLangsRef = useRef<Set<Language>>(new Set());

  function handleToneChange(next: Tone) {
    setTone(next);
    persistTone(next);
  }

  const t = translations[language];
  const canStart = player1.trim().length > 0 && player2.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (shownLangsRef.current.has(language)) {
      return;
    }
    shownLangsRef.current.add(language);
    void track("suggestion_shown", { lang: language });
  }, [language]);

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    setTopic("");
    setActiveSuggestion(null);
  }

  function handlePickSuggestion(battle: SuggestedBattle) {
    setPlayer1(battle.fighterA);
    setPlayer2(battle.fighterB);
    setTopic(battle.topic);
    setActiveSuggestion(battle);
    void track("suggestion_clicked", {
      id: battle.id,
      lang: battle.lang,
      isLive: battle.isLive,
    });
  }

  function fieldsMatchSuggestion(suggestion: SuggestedBattle | null): suggestion is SuggestedBattle {
    if (!suggestion) {
      return false;
    }
    return (
      suggestion.fighterA === player1.trim() &&
      suggestion.fighterB === player2.trim() &&
      (suggestion.topic === topic.trim() || (!topic.trim() && suggestion.topic === t.defaultTopic))
    );
  }

  function handleSubmit() {
    if (!canStart) return;
    const matched = fieldsMatchSuggestion(activeSuggestion) ? activeSuggestion : null;
    const liveContext = matched?.isLive ?? false;
    void track("battle_started", {
      source: matched ? "suggestion" : "manual",
      lang: language,
      isLive: liveContext,
      suggestionId: matched?.id ?? null,
      tone,
    });
    onStart(
      player1.trim(),
      player2.trim(),
      topic.trim() || t.defaultTopic,
      language,
      liveContext,
      tone
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canStart) handleSubmit();
  }

  return (
    <div className="intro-screen">
      <div className="screen-bg" />

      <div className="lang-selector lang-selector--corner">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            className={`lang-btn${language === l.code ? " lang-btn--active" : ""}`}
            onClick={() => handleLanguageChange(l.code)}
            disabled={isLoading}
            title={l.label}
            aria-label={l.label}
          >
            <Flag code={l.code} className="lang-flag" />
            <span className="lang-label">{l.label}</span>
          </button>
        ))}
      </div>

      <div className="intro-content">
        <p className="intro-matchup">{t.epicDebateBattle}</p>

        <SuggestionRow
          language={language}
          heading={t.suggestionsHeading}
          liveLabel={t.liveTag}
          disabled={isLoading}
          onPick={handlePickSuggestion}
        />

        <div className="intro-inputs">
          <div className="intro-input-row">
            <label className="intro-input-label intro-input-label--a">{t.player1}</label>
            <input
              className="pixel-input pixel-input--a"
              type="text"
              placeholder="e.g. Messi"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={40}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="intro-vs-divider">
            <span className="vs-word">VS</span>
          </div>

          <div className="intro-input-row">
            <label className="intro-input-label intro-input-label--b">{t.player2}</label>
            <input
              className="pixel-input pixel-input--b"
              type="text"
              placeholder="e.g. Cristiano"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={40}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="intro-topic-row">
          <label className="intro-input-label">{t.topic}</label>
          <input
            className="pixel-input pixel-input--topic"
            type="text"
            placeholder={t.defaultTopic}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            disabled={isLoading}
          />
        </div>

        <TonePicker
          tone={tone}
          onChange={handleToneChange}
          disabled={isLoading}
          labels={{
            heading: t.toneHeading,
            civil: t.toneCivil,
            civilDesc: t.toneCivilDesc,
            heated: t.toneHeated,
            heatedDesc: t.toneHeatedDesc,
            savage: t.toneSavage,
            savageDesc: t.toneSavageDesc,
          }}
        />

        {isLoading ? (
          <p className="intro-loading-hint">{t.generating}</p>
        ) : (
          <PixelButton
            label={t.startBattle}
            onClick={handleSubmit}
            size="lg"
            disabled={!canStart}
          />
        )}
      </div>
    </div>
  );
}
