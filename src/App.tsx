import { useState, useRef, useCallback } from "react";
import type { GamePhase, Battle, JudgeVerdict, Language } from "./types/battle";
import { normalizeBattle } from "./utils/battleNormalizer";
import { createFallbackBattle } from "./data/emergencyFallbackBattle";
import { translations } from "./data/i18n";
import { cn } from "./utils/classNames";

import IntroScreen from "./components/IntroScreen";
import VsScreen from "./components/VsScreen";
import DebateScreen from "./components/DebateScreen";
import JudgeScreen from "./components/JudgeScreen";
import ResultScreen from "./components/ResultScreen";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/app.css";
import "./styles/screens.css";
import "./styles/components.css";

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [battle, setBattle] = useState<Battle | null>(null);
  const [verdict, setVerdict] = useState<JudgeVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const abortRef = useRef<AbortController>(new AbortController());

  const t = translations[language];

  const handleStart = useCallback(async (player1: string, player2: string, topic: string, lang: Language) => {
    abortRef.current.abort();
    abortRef.current = new AbortController();

    setLanguage(lang);
    setIsLoading(true);
    setBattle(null);
    setVerdict(null);

    try {
      const res = await fetch("/api/start-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fighterAName: player1,
          fighterBName: player2,
          topic,
          language: lang,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const raw: unknown = await res.json();
      const normalized = normalizeBattle(raw);
      setBattle(normalized);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setIsLoading(false);
        return;
      }
      console.warn("Debate API failed, using fallback battle:", err);
      setBattle(createFallbackBattle(player1, player2, topic));
    }

    setIsLoading(false);
    setPhase("vs");
  }, []);

  const handleVsComplete = useCallback(() => setPhase("debate"), []);

  const handleDebateComplete = useCallback((v: JudgeVerdict) => {
    setVerdict(v);
    setPhase("judge");
  }, []);

  const handleJudgeContinue = useCallback(() => setPhase("result"), []);

  const handleRestart = useCallback(() => {
    abortRef.current.abort();
    abortRef.current = new AbortController();
    setBattle(null);
    setVerdict(null);
    setIsLoading(false);
    setPhase("intro");
  }, []);

  return (
    <>
      <div className={cn("screen", phase === "intro" && "active")}>
        <IntroScreen onStart={handleStart} isLoading={isLoading} />
      </div>

      {battle && (
        <>
          <div className={cn("screen", phase === "vs" && "active")}>
            <VsScreen fighters={battle.fighters} onComplete={handleVsComplete} />
          </div>

          <div className={cn("screen", phase === "debate" && "active")}>
            {phase === "debate" && (
              <DebateScreen
                battle={battle}
                onComplete={handleDebateComplete}
                abortSignal={abortRef.current.signal}
                t={t}
              />
            )}
          </div>

          <div className={cn("screen", phase === "judge" && "active")}>
            {verdict && (
              <JudgeScreen
                verdict={verdict}
                winnerName={battle.fighters.find((f) => f.id === verdict.winner)!.name}
                onContinue={handleJudgeContinue}
                t={t}
              />
            )}
          </div>

          <div className={cn("screen", phase === "result" && "active")}>
            {phase === "result" && (
              <ResultScreen battle={battle} onRestart={handleRestart} t={t} />
            )}
          </div>
        </>
      )}
    </>
  );
}
