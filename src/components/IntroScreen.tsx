import { useState } from "react";
import type { Language } from "../types/battle";
import { LANGUAGES, translations } from "../data/i18n";
import type { BillingStatus, PlanCode } from "../types/billing";
import BillingPanel from "./BillingPanel";
import PixelButton from "./PixelButton";

interface IntroScreenProps {
  onStart: (player1: string, player2: string, topic: string, language: Language) => void;
  isLoading: boolean;
  authEnabled: boolean;
  isAuthLoading: boolean;
  isBillingLoading: boolean;
  isMagicLinkSending: boolean;
  checkoutLoadingPlan: PlanCode | null;
  portalLoading: boolean;
  userEmail: string | null;
  authEmailInput: string;
  billingStatus: BillingStatus | null;
  authMessage: string | null;
  billingError: string | null;
  onAuthEmailChange: (value: string) => void;
  onSendMagicLink: () => void;
  onSignOut: () => void;
  onBuyPlan: (planCode: PlanCode) => void;
  onManagePlan: () => void;
}

export default function IntroScreen({
  onStart,
  isLoading,
  authEnabled,
  isAuthLoading,
  isBillingLoading,
  isMagicLinkSending,
  checkoutLoadingPlan,
  portalLoading,
  userEmail,
  authEmailInput,
  billingStatus,
  authMessage,
  billingError,
  onAuthEmailChange,
  onSendMagicLink,
  onSignOut,
  onBuyPlan,
  onManagePlan,
}: IntroScreenProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [topic, setTopic] = useState("");

  const t = translations[language];
  const canStart = player1.trim().length > 0 && player2.trim().length > 0 && !isLoading;

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    // Reset topic so the placeholder updates to the new language default
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

        {/* Language selector */}
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

        <BillingPanel
          t={t}
          authEnabled={authEnabled}
          isAuthLoading={isAuthLoading}
          isBillingLoading={isBillingLoading}
          isMagicLinkSending={isMagicLinkSending}
          checkoutLoadingPlan={checkoutLoadingPlan}
          portalLoading={portalLoading}
          userEmail={userEmail}
          authEmailInput={authEmailInput}
          billingStatus={billingStatus}
          authMessage={authMessage}
          billingError={billingError}
          onAuthEmailChange={onAuthEmailChange}
          onSendMagicLink={onSendMagicLink}
          onSignOut={onSignOut}
          onBuyPlan={onBuyPlan}
          onManagePlan={onManagePlan}
        />
      </div>
    </div>
  );
}
