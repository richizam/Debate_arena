import { useEffect, useRef, useState } from "react";
import type { Translations } from "../data/i18n";
import { track } from "../utils/analytics";
import { getApiUrl } from "../utils/api";
import { claimShareBonus, hasUnclaimedShareBonus } from "../utils/shareBonus";
import Countdown from "./Countdown";
import PixelButton from "./PixelButton";

interface LimitScreenProps {
  onBack: () => void;
  onMemberAccess: () => void;
  t: Translations;
}

const SHARE_URL = "https://www.debatearena.xyz";

function todayUtc(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(
    now.getUTCDate()
  ).padStart(2, "0")}`;
}

export default function LimitScreen({ onBack, onMemberAccess, t }: LimitScreenProps) {
  const trackedRef = useRef(false);
  const [shared, setShared] = useState<boolean>(() => hasUnclaimedShareBonus());

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }
    trackedRef.current = true;
    void track("limit_reached");
  }, []);

  function handleShare() {
    void track("share_clicked", { surface: "limit" });
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      t.limitShareTweet
    )}&url=${encodeURIComponent(SHARE_URL)}`;
    window.open(intent, "_blank", "noopener,noreferrer");

    const claimed = claimShareBonus();
    if (claimed) {
      const battleHash = `limit:${todayUtc()}`;
      void track("share_claim_attempted", { surface: "limit" });
      void fetch(getApiUrl("/api/share-claim"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ battleHash, surface: "limit" }),
        keepalive: true,
      }).catch(() => {
        // audit-only; never break the UX
      });
    }
    setShared(true);
  }

  function handleMemberAccess() {
    void track("plan_clicked", { surface: "limit" });
    onMemberAccess();
  }

  return (
    <div className="limit-screen">
      <div className="screen-bg" />
      <div className="limit-content">
        <p className="limit-title">{t.limitTitle}</p>
        <p className="limit-subtitle">{t.limitSubtitle}</p>

        <div className="limit-countdown">
          <p className="limit-countdown__label">{t.limitCountdownLabel}</p>
          <Countdown className="limit-countdown__value" />
        </div>

        {shared ? (
          <div className="limit-share-success">
            <p className="limit-share-success__title">{t.limitShareSuccess}</p>
            <PixelButton label={t.limitPlayNow} onClick={onBack} size="lg" />
          </div>
        ) : (
          <div className="limit-share-offer">
            <p className="limit-share-offer__title">{t.limitShareOfferTitle}</p>
            <p className="limit-share-offer__desc">{t.limitShareOfferDesc}</p>
            <PixelButton label={t.limitShareLabel} onClick={handleShare} variant="red" size="lg" />
          </div>
        )}

        <div className="limit-coming-soon">
          <p className="limit-coming-soon-label">{t.limitComingSoon}</p>
          <p className="limit-coming-soon-desc">{t.limitComingSoonDesc}</p>
        </div>

        <div className="limit-actions">
          <PixelButton label={t.limitBuy} onClick={handleMemberAccess} size="lg" />
          <PixelButton label={t.limitBack} onClick={onBack} variant="blue" />
        </div>
        <p className="limit-share-hint">{t.limitShareCta}</p>
      </div>
    </div>
  );
}
