import type { Translations } from "../data/i18n";
import type { BillingStatus, PlanCode } from "../types/billing";
import { BILLING_PLANS } from "../types/billing";
import PixelButton from "./PixelButton";

interface BillingPanelProps {
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

function formatExpiryDate(value: string | null): string {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  return date.toLocaleDateString();
}

export default function BillingPanel({
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
}: BillingPanelProps) {
  if (!authEnabled) {
    return (
      <div className="billing-panel">
        <p className="billing-panel__message">{t.billingUnavailable}</p>
      </div>
    );
  }

  const isSignedIn = Boolean(userEmail);

  return (
    <div className="billing-panel">
      <div className="billing-panel__header">
        <p className="billing-panel__title">{t.billingTitle}</p>
        <p className="billing-panel__subtitle">{t.billingSubtitle}</p>
      </div>

      {isSignedIn ? (
        <div className="billing-panel__account">
          <p className="billing-panel__account-label">
            {t.signedInAs}: <span>{userEmail}</span>
          </p>

          <div className="billing-panel__stats">
            <div className="billing-stat">
              <span className="billing-stat__label">{t.creditsRemaining}</span>
              <strong className="billing-stat__value">
                {isBillingLoading ? "..." : billingStatus?.creditsRemaining ?? 0}
              </strong>
            </div>
            <div className="billing-stat">
              <span className="billing-stat__label">{t.creditsExpire}</span>
              <strong className="billing-stat__value">
                {isBillingLoading ? "..." : formatExpiryDate(billingStatus?.expiresAt ?? null)}
              </strong>
            </div>
          </div>

          {billingError && <p className="billing-panel__error">{billingError}</p>}

          <div className="billing-panel__plans">
            {BILLING_PLANS.map((plan) => (
              <button
                key={plan.code}
                type="button"
                className={`billing-plan${
                  billingStatus?.currentPlanCode === plan.code ? " billing-plan--active" : ""
                }`}
                disabled={Boolean(checkoutLoadingPlan) || portalLoading}
                onClick={() => onBuyPlan(plan.code)}
              >
                <span className="billing-plan__name">{plan.label}</span>
                <span className="billing-plan__price">{plan.price}</span>
                <span className="billing-plan__action">
                  {checkoutLoadingPlan === plan.code ? t.loadingBilling : t.subscribeNow}
                </span>
              </button>
            ))}
          </div>

          <div className="billing-panel__actions">
            <PixelButton
              label={portalLoading ? t.loadingBilling : t.managePlan}
              onClick={onManagePlan}
              disabled={portalLoading}
            />
            <PixelButton
              label={t.signOut}
              onClick={onSignOut}
              variant="red"
              disabled={portalLoading || Boolean(checkoutLoadingPlan)}
            />
          </div>
        </div>
      ) : (
        <div className="billing-panel__signin">
          <label className="intro-input-label">{t.emailLabel}</label>
          <div className="billing-panel__signin-row">
            <input
              className="pixel-input billing-panel__input"
              type="email"
              placeholder={t.emailPlaceholder}
              value={authEmailInput}
              onChange={(event) => onAuthEmailChange(event.target.value)}
              disabled={isAuthLoading || isMagicLinkSending}
            />
            <PixelButton
              label={isMagicLinkSending ? t.sendingMagicLink : t.sendMagicLink}
              onClick={onSendMagicLink}
              disabled={isAuthLoading || isMagicLinkSending || authEmailInput.trim().length === 0}
            />
          </div>
          <p className="billing-panel__hint">{t.authHint}</p>
          {billingError && <p className="billing-panel__error">{billingError}</p>}
          {authMessage && <p className="billing-panel__message">{authMessage}</p>}
        </div>
      )}
    </div>
  );
}
