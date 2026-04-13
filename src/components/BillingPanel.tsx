import type { Translations } from "../data/i18n";
import type { BillingStatus, PlanCode } from "../types/billing";
import { BILLING_PLANS } from "../types/billing";
import PixelButton from "./PixelButton";

export type AuthMode = "signin" | "signup" | "reset" | "update-password";

interface BillingPanelProps {
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

function formatExpiryDate(value: string | null): string {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  return date.toLocaleDateString();
}

function getSubmitLabel(t: Translations, authMode: AuthMode, isAuthSubmitting: boolean): string {
  if (isAuthSubmitting) {
    return t.loadingBilling;
  }

  if (authMode === "signin") {
    return t.signInAction;
  }

  if (authMode === "signup") {
    return t.createAccountAction;
  }

  if (authMode === "reset") {
    return t.resetPasswordAction;
  }

  return t.updatePasswordAction;
}

export default function BillingPanel({
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
}: BillingPanelProps) {
  if (!authEnabled) {
    return (
      <div className="billing-panel">
        <p className="billing-panel__message">{t.billingUnavailable}</p>
      </div>
    );
  }

  const isSignedIn = Boolean(userEmail);
  const showEmailField = authMode !== "update-password";
  const showPasswordField = authMode === "signin" || authMode === "signup" || authMode === "update-password";
  const canSubmit =
    authMode === "update-password"
      ? authPasswordInput.trim().length >= 6
      : authMode === "reset"
        ? authEmailInput.trim().length > 0
        : authEmailInput.trim().length > 0 && authPasswordInput.trim().length >= 6;

  function handleSubmit() {
    if (authMode === "signin") {
      onSignIn();
      return;
    }

    if (authMode === "signup") {
      onSignUp();
      return;
    }

    if (authMode === "reset") {
      onResetPassword();
      return;
    }

    onUpdatePassword();
  }

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
          <div className="billing-panel__tabs">
            <button
              type="button"
              className={`billing-panel__tab${authMode === "signin" ? " billing-panel__tab--active" : ""}`}
              onClick={() => onAuthModeChange("signin")}
              disabled={isAuthLoading || isAuthSubmitting}
            >
              {t.signInAction}
            </button>
            <button
              type="button"
              className={`billing-panel__tab${authMode === "signup" ? " billing-panel__tab--active" : ""}`}
              onClick={() => onAuthModeChange("signup")}
              disabled={isAuthLoading || isAuthSubmitting}
            >
              {t.createAccountAction}
            </button>
            <button
              type="button"
              className={`billing-panel__tab${authMode === "reset" ? " billing-panel__tab--active" : ""}`}
              onClick={() => onAuthModeChange("reset")}
              disabled={isAuthLoading || isAuthSubmitting}
            >
              {t.forgotPassword}
            </button>
          </div>

          {showEmailField && (
            <>
              <label className="intro-input-label">{t.emailLabel}</label>
              <input
                className="pixel-input billing-panel__input"
                type="email"
                placeholder={t.emailPlaceholder}
                value={authEmailInput}
                onChange={(event) => onAuthEmailChange(event.target.value)}
                disabled={isAuthLoading || isAuthSubmitting}
              />
            </>
          )}

          {showPasswordField && (
            <>
              <label className="intro-input-label">{t.passwordLabel}</label>
              <input
                className="pixel-input billing-panel__input"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={authPasswordInput}
                onChange={(event) => onAuthPasswordChange(event.target.value)}
                disabled={isAuthLoading || isAuthSubmitting}
              />
            </>
          )}

          <p className="billing-panel__hint">
            {authMode === "signup"
              ? t.signUpHint
              : authMode === "reset"
                ? t.resetPasswordHint
                : authMode === "update-password"
                  ? t.updatePasswordHint
                  : t.signInHint}
          </p>

          <div className="billing-panel__actions">
            <PixelButton
              label={getSubmitLabel(t, authMode, isAuthSubmitting)}
              onClick={handleSubmit}
              disabled={isAuthLoading || isAuthSubmitting || !canSubmit}
            />
            {authMode === "reset" || authMode === "update-password" ? (
              <PixelButton
                label={t.backToSignIn}
                onClick={() => onAuthModeChange("signin")}
                variant="blue"
                disabled={isAuthLoading || isAuthSubmitting}
              />
            ) : null}
          </div>

          {billingError && <p className="billing-panel__error">{billingError}</p>}
          {authMessage && <p className="billing-panel__message">{authMessage}</p>}
        </div>
      )}
    </div>
  );
}
