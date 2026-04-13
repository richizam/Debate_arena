import { useState } from "react";
import type { Language } from "../types/battle";
import { LANGUAGES, translations } from "../data/i18n";
import PixelButton from "./PixelButton";

interface IntroScreenProps {
  onStart: (player1: string, player2: string, topic: string, language: Language) => void;
  isLoading: boolean;
}

export default function IntroScreen({ onStart, isLoading }: IntroScreenProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [topic, setTopic] = useState("");

  const t = translations[language];
  const canStart = player1.trim().length > 0 && player2.trim().length > 0 && !isLoading;

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    setTopic("");
  }

  function handleSubmit() {
    if (!canStart) return;
    onStart(player1.trim(), player2.trim(), topic.trim() || t.defaultTopic, language);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canStart) handleSubmit();
  }

  return (
    <div className="intro-screen">
      <div className="screen-bg" />

      <div className="intro-content">
        <p className="intro-matchup">{t.epicDebateBattle}</p>

        <div className="lang-selector">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-btn${language === l.code ? " lang-btn--active" : ""}`}
              onClick={() => handleLanguageChange(l.code)}
              disabled={isLoading}
              title={l.label}
            >
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-label">{l.label}</span>
            </button>
          ))}
        </div>

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
