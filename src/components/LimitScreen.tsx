import type { Translations } from "../data/i18n";
import PixelButton from "./PixelButton";

// Placeholder — replace with your real Gumroad link once the product is live
const GUMROAD_URL = "https://richizam.gumroad.com/l/debate-arena";

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

        <p className="limit-or">{t.limitOr}</p>

        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="limit-buy-link"
        >
          <PixelButton label={t.limitBuy} onClick={() => {}} size="lg" />
        </a>

        <div className="limit-back">
          <PixelButton label={t.limitBack} onClick={onBack} />
        </div>
      </div>
    </div>
  );
}
