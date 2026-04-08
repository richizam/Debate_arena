import type { Translations } from "../data/i18n";
import PixelButton from "./PixelButton";

interface LimitScreenProps {
  onBack: () => void;
  t: Translations;
}

export default function LimitScreen({ onBack, t }: LimitScreenProps) {
  return (
    <div className="limit-screen">
      <div className="screen-bg" />
      <div className="limit-content">
        <p className="limit-title">{t.limitTitle}</p>
        <p className="limit-subtitle">{t.limitSubtitle}</p>
        <p className="limit-come-back">{t.limitComeBack}</p>

        <div className="limit-coming-soon">
          <p className="limit-coming-soon-label">{t.limitComingSoon}</p>
          <p className="limit-coming-soon-desc">{t.limitComingSoonDesc}</p>
        </div>

        <div className="limit-back">
          <PixelButton label={t.limitBack} onClick={onBack} />
        </div>
      </div>
    </div>
  );
}
