import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import type { GamePhase, Battle, JudgeVerdict, Language } from "./types/battle";
import type { BillingStatusResponse, PlanCode } from "./types/billing";
import { normalizeBattle } from "./utils/battleNormalizer";
import { createFallbackBattle } from "./data/emergencyFallbackBattle";
import { translations } from "./data/i18n";
import { cn } from "./utils/classNames";
import { getApiUrl } from "./utils/api";
import { hasUsedDailyDebate, markDailyDebateUsed } from "./utils/dailyLimit";
import { hasSupabaseAuthConfig, supabase } from "./utils/supabase";

import IntroScreen from "./components/IntroScreen";
import VsScreen from "./components/VsScreen";
import DebateScreen from "./components/DebateScreen";
import JudgeScreen from "./components/JudgeScreen";
import ResultScreen from "./components/ResultScreen";
import LimitScreen from "./components/LimitScreen";
import type { AuthMode } from "./components/BillingPanel";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/app.css";
import "./styles/screens.css";
import "./styles/components.css";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorPayload;
    return data.error?.message ?? `API error ${response.status}`;
  } catch {
    return `API error ${response.status}`;
  }
}

function getAuthSuccessMessage(event: AuthChangeEvent): string | null {
  if (event === "PASSWORD_RECOVERY") {
    return "Enter your new password to finish recovery.";
  }

  if (event === "SIGNED_IN") {
    return null;
  }

  return null;
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [battle, setBattle] = useState<Battle | null>(null);
  const [verdict, setVerdict] = useState<JudgeVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [authPasswordInput, setAuthPasswordInput] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<PlanCode | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingStatus, setBillingStatus] = useState<BillingStatusResponse | null>(null);
  const abortRef = useRef<AbortController>(new AbortController());

  const t = translations[language];
  const accessToken = session?.access_token ?? null;
  const userEmail = session?.user.email ?? null;

  const handleAuthModeChange = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthMessage(null);
    setBillingError(null);
    setAuthPasswordInput("");
  }, []);

  const fetchBillingStatus = useCallback(async (token: string) => {
    setIsBillingLoading(true);
    setBillingError(null);

    try {
      const response = await fetch(getApiUrl("/api/billing/status"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response));
      }

      const data = (await response.json()) as BillingStatusResponse;
      setBillingStatus(data);
    } catch (error) {
      setBillingError(getErrorMessage(error, "Unable to load billing status."));
      setBillingStatus(null);
    } finally {
      setIsBillingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsAuthLoading(false);

      if (data.session?.user.email) {
        setAuthEmailInput(data.session.user.email);
      }

      if (data.session?.access_token) {
        void fetchBillingStatus(data.session.access_token);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);

      if (nextSession?.user.email) {
        setAuthEmailInput(nextSession.user.email);
      }

      const nextMessage = getAuthSuccessMessage(event);
      if (nextMessage) {
        setAuthMessage(nextMessage);
      }

      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("update-password");
        setBillingError(null);
      } else if (event === "SIGNED_IN") {
        setAuthMode("signin");
        setAuthPasswordInput("");
        setBillingError(null);
        setAuthMessage(null);
      } else if (event === "SIGNED_OUT") {
        setAuthMode("signin");
        setBillingStatus(null);
        setBillingError(null);
        setAuthPasswordInput("");
      }

      if (nextSession?.access_token) {
        void fetchBillingStatus(nextSession.access_token);
      } else {
        setBillingStatus(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchBillingStatus]);

  const handleStart = useCallback(
    async (player1: string, player2: string, topic: string, lang: Language) => {
      abortRef.current.abort();
      abortRef.current = new AbortController();

      const isSignedIn = Boolean(accessToken);

      if (!isSignedIn && hasUsedDailyDebate()) {
        setLanguage(lang);
        setPhase("limit");
        return;
      }

      setLanguage(lang);
      setIsLoading(true);
      setBattle(null);
      setVerdict(null);
      setBillingError(null);

      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const res = await fetch(getApiUrl("/api/start-battle"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            fighterAName: player1,
            fighterBName: player2,
            topic,
            language: lang,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          if (res.status === 402) {
            if (accessToken) {
              await fetchBillingStatus(accessToken);
            }
            setPhase("limit");
            setIsLoading(false);
            return;
          }

          throw new Error(await readApiErrorMessage(res));
        }

        const raw = (await res.json()) as Record<string, unknown>;

        if (raw._billing && typeof raw._billing === "object") {
          setBillingStatus(raw._billing as BillingStatusResponse);
        }

        const normalized = normalizeBattle(raw);
        setBattle(normalized);

        if (!isSignedIn) {
          markDailyDebateUsed();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setIsLoading(false);
          return;
        }

        if (accessToken) {
          setBillingError(getErrorMessage(err, "Unable to generate a paid debate right now."));
          setIsLoading(false);
          return;
        }

        console.warn("Debate API failed, using fallback battle:", err);
        setBattle(createFallbackBattle(player1, player2, topic));
        markDailyDebateUsed();
      }

      setIsLoading(false);
      setPhase("vs");
    },
    [accessToken, fetchBillingStatus]
  );

  const handleSignIn = useCallback(async () => {
    if (!supabase || authEmailInput.trim().length === 0 || authPasswordInput.trim().length < 6) {
      return;
    }

    setIsAuthSubmitting(true);
    setAuthMessage(null);
    setBillingError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmailInput.trim(),
      password: authPasswordInput,
    });

    if (error) {
      setBillingError(error.message);
    }

    setIsAuthSubmitting(false);
  }, [authEmailInput, authPasswordInput]);

  const handleSignUp = useCallback(async () => {
    if (!supabase || authEmailInput.trim().length === 0 || authPasswordInput.trim().length < 6) {
      return;
    }

    setIsAuthSubmitting(true);
    setAuthMessage(null);
    setBillingError(null);

    const { data, error } = await supabase.auth.signUp({
      email: authEmailInput.trim(),
      password: authPasswordInput,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setBillingError(error.message);
    } else if (data.session) {
      setAuthMessage("Account created. You are signed in.");
      setAuthPasswordInput("");
    } else {
      setAuthMessage("Check your email to confirm the account before signing in.");
      setAuthMode("signin");
      setAuthPasswordInput("");
    }

    setIsAuthSubmitting(false);
  }, [authEmailInput, authPasswordInput]);

  const handleResetPassword = useCallback(async () => {
    if (!supabase || authEmailInput.trim().length === 0) {
      return;
    }

    setIsAuthSubmitting(true);
    setAuthMessage(null);
    setBillingError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(authEmailInput.trim(), {
      redirectTo: window.location.origin,
    });

    if (error) {
      setBillingError(error.message);
    } else {
      setAuthMessage("Check your email for the password reset link.");
    }

    setIsAuthSubmitting(false);
  }, [authEmailInput]);

  const handleUpdatePassword = useCallback(async () => {
    if (!supabase || authPasswordInput.trim().length < 6) {
      return;
    }

    setIsAuthSubmitting(true);
    setAuthMessage(null);
    setBillingError(null);

    const { error } = await supabase.auth.updateUser({
      password: authPasswordInput,
    });

    if (error) {
      setBillingError(error.message);
    } else {
      setAuthMessage("Password updated. You can keep using the app.");
      setAuthMode("signin");
      setAuthPasswordInput("");
    }

    setIsAuthSubmitting(false);
  }, [authPasswordInput]);

  const handleSignOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    setPortalLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setBillingError(error.message);
    } else {
      setAuthMessage(null);
      setBillingStatus(null);
      setPhase("intro");
    }
    setPortalLoading(false);
  }, []);

  const handleBuyPlan = useCallback(
    async (planCode: PlanCode) => {
      if (!accessToken) {
        setBillingError("Sign in first to start checkout.");
        return;
      }

      setCheckoutLoadingPlan(planCode);
      setBillingError(null);

      try {
        const response = await fetch(getApiUrl("/api/billing/create-checkout-session"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ planCode }),
        });

        if (!response.ok) {
          throw new Error(await readApiErrorMessage(response));
        }

        const data = (await response.json()) as { checkoutUrl: string };
        window.location.href = data.checkoutUrl;
      } catch (error) {
        setBillingError(getErrorMessage(error, "Unable to create checkout session."));
      } finally {
        setCheckoutLoadingPlan(null);
      }
    },
    [accessToken]
  );

  const handleManagePlan = useCallback(async () => {
    if (!accessToken) {
      setBillingError("Sign in first to manage billing.");
      return;
    }

    setPortalLoading(true);
    setBillingError(null);

    try {
      const response = await fetch(getApiUrl("/api/billing/create-portal-session"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response));
      }

      const data = (await response.json()) as { portalUrl: string };
      window.location.href = data.portalUrl;
    } catch (error) {
      setBillingError(getErrorMessage(error, "Unable to open billing portal."));
    } finally {
      setPortalLoading(false);
    }
  }, [accessToken]);

  const handleVsComplete = useCallback(() => setPhase("debate"), []);

  const handleDebateComplete = useCallback((v: JudgeVerdict) => {
    setVerdict(v);
    setPhase("judge");
  }, []);

  const handleJudgeContinue = useCallback(() => setPhase("result"), []);

  const handleLimitBack = useCallback(() => setPhase("intro"), []);

  const handleRestart = useCallback(() => {
    abortRef.current.abort();
    abortRef.current = new AbortController();
    setBattle(null);
    setVerdict(null);
    setIsLoading(false);
    setPhase("intro");
  }, []);

  return (
    <>
      <div className={cn("screen", phase === "intro" && "active")}>
        <IntroScreen
          onStart={handleStart}
          isLoading={isLoading}
          authEnabled={hasSupabaseAuthConfig}
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
          onAuthEmailChange={setAuthEmailInput}
          onAuthPasswordChange={setAuthPasswordInput}
          onAuthModeChange={handleAuthModeChange}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onResetPassword={handleResetPassword}
          onUpdatePassword={handleUpdatePassword}
          onSignOut={handleSignOut}
          onBuyPlan={handleBuyPlan}
          onManagePlan={handleManagePlan}
        />
      </div>

      <div className={cn("screen", phase === "limit" && "active")}>
        <LimitScreen
          onBack={handleLimitBack}
          t={t}
          authEnabled={hasSupabaseAuthConfig}
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
          onAuthEmailChange={setAuthEmailInput}
          onAuthPasswordChange={setAuthPasswordInput}
          onAuthModeChange={handleAuthModeChange}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onResetPassword={handleResetPassword}
          onUpdatePassword={handleUpdatePassword}
          onSignOut={handleSignOut}
          onBuyPlan={handleBuyPlan}
          onManagePlan={handleManagePlan}
        />
      </div>

      {battle && (
        <>
          <div className={cn("screen", phase === "vs" && "active")}>
            <VsScreen fighters={battle.fighters} onComplete={handleVsComplete} />
          </div>

          <div className={cn("screen", phase === "debate" && "active")}>
            {phase === "debate" && (
              <DebateScreen
                battle={battle}
                onComplete={handleDebateComplete}
                abortSignal={abortRef.current.signal}
                t={t}
              />
            )}
          </div>

          <div className={cn("screen", phase === "judge" && "active")}>
            {verdict && (
              <JudgeScreen
                verdict={verdict}
                winnerName={battle.fighters.find((f) => f.id === verdict.winner)!.name}
                onContinue={handleJudgeContinue}
                t={t}
              />
            )}
          </div>

          <div className={cn("screen", phase === "result" && "active")}>
            {phase === "result" && (
              <ResultScreen battle={battle} onRestart={handleRestart} t={t} />
            )}
          </div>
        </>
      )}
    </>
  );
}
