import type { Translations } from "../data/i18n";
import PixelButton from "./PixelButton";

interface LimitScreenProps {
  onBack: () => void;
  onMemberAccess: () => void;
  t: Translations;
}

export default function LimitScreen({ onBack, onMemberAccess, t }: LimitScreenProps) {
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

        <div className="limit-actions">
          <PixelButton label={t.limitBuy} onClick={onMemberAccess} size="lg" />
          <PixelButton label={t.limitBack} onClick={onBack} variant="blue" />
        </div>
      </div>
    </div>
  );
}
