import type { JudgeVerdict } from "../types/battle";
import type { Translations } from "../data/i18n";
import PixelButton from "./PixelButton";

interface JudgeScreenProps {
  verdict: JudgeVerdict;
  winnerName: string;
  onContinue: () => void;
  t: Translations;
}

export default function JudgeScreen({ verdict, winnerName, onContinue, t }: JudgeScreenProps) {
  return (
    <div className="judge-screen">
      <div className="screen-bg" />
      <div className="judge-overlay" />

      <div className="judge-content">
        <div className="judge-portrait-wrap">
          <img src="./images/judge.png" alt="Judge" />
        </div>

        <h2 className="judge-title">{t.judgesVerdict}</h2>

        <p className={`judge-winner judge-winner--${verdict.winner}`}>
          {t.winner}: {winnerName}
        </p>

        <p className="judge-reason">{verdict.reason}</p>

        <div className="judge-continue">
          <PixelButton label={t.continueBtn} onClick={onContinue} size="lg" />
        </div>
      </div>
    </div>
  );
}
