import type { BillingStatus, PlanCode } from "../types/billing";
import type { Translations } from "../data/i18n";
import BillingPanel from "./BillingPanel";
import type { AuthMode } from "./BillingPanel";

interface AuthPageProps {
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

function getPageTitle(t: Translations, authMode: AuthMode, userEmail: string | null): string {
  if (userEmail) {
    return t.billingTitle;
  }

  if (authMode === "signup") {
    return t.createAccountAction;
  }

  if (authMode === "reset") {
    return t.resetPasswordAction;
  }

  if (authMode === "update-password") {
    return t.updatePasswordAction;
  }

  return t.signInAction;
}

function getPageSubtitle(t: Translations, authMode: AuthMode, userEmail: string | null): string {
  if (userEmail) {
    return t.billingSubtitle;
  }

  if (authMode === "signup") {
    return t.signUpHint;
  }

  if (authMode === "reset") {
    return t.resetPasswordHint;
  }

  if (authMode === "update-password") {
    return t.updatePasswordHint;
  }

  return t.signInHint;
}

export default function AuthPage(props: AuthPageProps) {
  const title = getPageTitle(props.t, props.authMode, props.userEmail);
  const subtitle = getPageSubtitle(props.t, props.authMode, props.userEmail);

  return (
    <div className="auth-screen">
      <div className="screen-bg" />
      <div className="auth-overlay" />
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-card__header">
            <p className="auth-card__eyebrow">{props.t.epicDebateBattle}</p>
            <h1 className="auth-card__title">{title}</h1>
            <p className="auth-card__subtitle">{subtitle}</p>
          </div>

          <BillingPanel {...props} />
        </div>
      </div>
    </div>
  );
}
