import type { Translations } from "../data/i18n";
import type { BillingStatus, PlanCode } from "../types/billing";
import BillingPanel from "./BillingPanel";
import PixelButton from "./PixelButton";

interface LimitScreenProps {
  onBack: () => void;
  t: Translations;
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

export default function LimitScreen({
  onBack,
  t,
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
}: LimitScreenProps) {
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
