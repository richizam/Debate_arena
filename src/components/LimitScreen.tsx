import type { Translations } from "../data/i18n";
import type { BillingStatus, PlanCode } from "../types/billing";
import BillingPanel from "./BillingPanel";
import type { AuthMode } from "./BillingPanel";
import PixelButton from "./PixelButton";

interface LimitScreenProps {
  onBack: () => void;
  t: Translations;
  authEnabled: boolean;
  authMode: AuthMode;
  isAuthLoading: boolean;
  isAuthSubmitting: boolean;
  isBillingLoading: boolean;
  checkoutLoadingPlan: PlanCode | null;
  portalLoading: boolean;
  userEmail: string | null;
  authEmailInput: string;
  authPasswordInput: string;
  billingStatus: BillingStatus | null;
  authMessage: string | null;
  billingError: string | null;
  onAuthEmailChange: (value: string) => void;
  onAuthPasswordChange: (value: string) => void;
  onAuthModeChange: (mode: AuthMode) => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onResetPassword: () => void;
  onUpdatePassword: () => void;
  onSignOut: () => void;
  onBuyPlan: (planCode: PlanCode) => void;
  onManagePlan: () => void;
}

export default function LimitScreen({
  onBack,
  t,
  authEnabled,
  authMode,
  isAuthLoading,
  isAuthSubmitting,
  isBillingLoading,
  checkoutLoadingPlan,
  portalLoading,
  userEmail,
  authEmailInput,
  authPasswordInput,
  billingStatus,
  authMessage,
  billingError,
  onAuthEmailChange,
  onAuthPasswordChange,
  onAuthModeChange,
  onSignIn,
  onSignUp,
  onResetPassword,
  onUpdatePassword,
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
          authMode={authMode}
          isAuthLoading={isAuthLoading}
          isAuthSubmitting={isAuthSubmitting}
          isBillingLoading={isBillingLoading}
          checkoutLoadingPlan={checkoutLoadingPlan}
          portalLoading={portalLoading}
          userEmail={userEmail}
          authEmailInput={authEmailInput}
          authPasswordInput={authPasswordInput}
          billingStatus={billingStatus}
          authMessage={authMessage}
          billingError={billingError}
          onAuthEmailChange={onAuthEmailChange}
          onAuthPasswordChange={onAuthPasswordChange}
          onAuthModeChange={onAuthModeChange}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          onResetPassword={onResetPassword}
          onUpdatePassword={onUpdatePassword}
          onSignOut={onSignOut}
          onBuyPlan={onBuyPlan}
          onManagePlan={onManagePlan}
        />
      </div>
    </div>
  );
}
