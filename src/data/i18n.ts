import type { Language } from "../types/battle";

export const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "EN", label: "EN" },
  { code: "es", flag: "ES", label: "ES" },
  { code: "de", flag: "DE", label: "DE" },
  { code: "fr", flag: "FR", label: "FR" },
  { code: "ru", flag: "RU", label: "RU" },
];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  ru: "Russian",
};

export interface Translations {
  epicDebateBattle: string;
  player1: string;
  player2: string;
  topic: string;
  defaultTopic: string;
  startBattle: string;
  generating: string;
  next: string;
  judgeVerdictBtn: string;
  judgesVerdict: string;
  winner: string;
  continueBtn: string;
  whoWon: string;
  vote: string;
  votedFor: string;
  rematch: string;
  limitTitle: string;
  limitSubtitle: string;
  limitComeBack: string;
  limitOr: string;
  limitBuy: string;
  limitBack: string;
  limitComingSoon: string;
  limitComingSoonDesc: string;
  billingTitle: string;
  billingSubtitle: string;
  billingUnavailable: string;
  signedInAs: string;
  creditsRemaining: string;
  creditsExpire: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInAction: string;
  createAccountAction: string;
  forgotPassword: string;
  resetPasswordAction: string;
  updatePasswordAction: string;
  signInHint: string;
  signUpHint: string;
  resetPasswordHint: string;
  updatePasswordHint: string;
  backToSignIn: string;
  accountAction: string;
  backToArena: string;
  signOut: string;
  subscribeNow: string;
  managePlan: string;
  loadingBilling: string;
}

const baseEnglish: Translations = {
  epicDebateBattle: "Epic Debate Battle",
  player1: "Player 1",
  player2: "Player 2",
  topic: "Topic",
  defaultTopic: "Who is the greatest of all time?",
  startBattle: "START BATTLE",
  generating: "GENERATING DEBATE...",
  next: "NEXT >",
  judgeVerdictBtn: "JUDGE VERDICT >",
  judgesVerdict: "Judge's Verdict",
  winner: "Winner",
  continueBtn: "CONTINUE",
  whoWon: "Who do YOU think won?",
  vote: "Vote",
  votedFor: "Voted for",
  rematch: "REMATCH",
  limitTitle: "DAILY LIMIT REACHED",
  limitSubtitle: "You've used your free debate for today.",
  limitComeBack: "Come back tomorrow for another free debate.",
  limitOr: "OR",
  limitBuy: "GET MEMBER ACCESS",
  limitBack: "BACK",
  limitComingSoon: "UPGRADE WITH A PAID PLAN",
  limitComingSoonDesc: "Create an account or sign in to unlock recurring monthly debate credits.",
  billingTitle: "Member Access",
  billingSubtitle: "Use an email and password to manage credits, subscriptions, and recovery.",
  billingUnavailable: "Billing login is not configured yet.",
  signedInAs: "Signed in as",
  creditsRemaining: "Credits",
  creditsExpire: "Expires",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  signInAction: "Sign In",
  createAccountAction: "Create Account",
  forgotPassword: "Forgot Password",
  resetPasswordAction: "Send Reset Link",
  updatePasswordAction: "Save New Password",
  signInHint: "Sign in with your email and password before buying a plan or managing credits.",
  signUpHint: "Create an account first. Supabase can handle email confirmation and password recovery.",
  resetPasswordHint: "Enter your email and Supabase will send you a password reset link.",
  updatePasswordHint: "Choose a new password to complete account recovery.",
  backToSignIn: "Back to Sign In",
  accountAction: "Account",
  backToArena: "Back to Arena",
  signOut: "Sign Out",
  subscribeNow: "Subscribe",
  managePlan: "Manage Plan",
  loadingBilling: "Loading...",
};

export const translations: Record<Language, Translations> = {
  en: baseEnglish,
  es: {
    ...baseEnglish,
    epicDebateBattle: "Batalla de Debate",
    player1: "Jugador 1",
    player2: "Jugador 2",
    topic: "Tema",
    defaultTopic: "Quien es el mejor de todos los tiempos?",
    startBattle: "INICIAR DEBATE",
    generating: "GENERANDO DEBATE...",
    judgesVerdict: "Veredicto del Juez",
    winner: "Ganador",
    continueBtn: "CONTINUAR",
    whoWon: "Quien crees que gano?",
    vote: "Votar por",
    votedFor: "Votaste por",
    rematch: "REVANCHA",
    limitTitle: "LIMITE DIARIO ALCANZADO",
    limitSubtitle: "Ya usaste tu debate gratis de hoy.",
    limitComeBack: "Vuelve manana para otro debate gratis.",
    limitBack: "VOLVER",
    limitComingSoon: "MEJORA CON UN PLAN DE PAGO",
    limitComingSoonDesc: "Crea cuenta o inicia sesion para desbloquear creditos mensuales.",
    billingTitle: "Acceso Member",
    billingSubtitle: "Usa email y contrasena para gestionar creditos y suscripciones.",
    signedInAs: "Sesion iniciada como",
    creditsRemaining: "Creditos",
    creditsExpire: "Expira",
    passwordLabel: "Contrasena",
    passwordPlaceholder: "Introduce tu contrasena",
    signInAction: "Iniciar Sesion",
    createAccountAction: "Crear Cuenta",
    forgotPassword: "Olvide mi Contrasena",
    resetPasswordAction: "Enviar Link",
    updatePasswordAction: "Guardar Nueva Contrasena",
    signInHint: "Inicia sesion antes de comprar un plan o gestionar creditos.",
    signUpHint: "Crea una cuenta. Supabase puede gestionar confirmacion y recuperacion.",
    resetPasswordHint: "Introduce tu email y Supabase enviara un link de recuperacion.",
    updatePasswordHint: "Elige una nueva contrasena para completar la recuperacion.",
    backToSignIn: "Volver a Iniciar",
    accountAction: "Cuenta",
    backToArena: "Volver al Arena",
    signOut: "Cerrar Sesion",
    subscribeNow: "Suscribirse",
    managePlan: "Gestionar Plan",
    loadingBilling: "Cargando...",
  },
  de: {
    ...baseEnglish,
    epicDebateBattle: "Epische Debatte",
    player1: "Spieler 1",
    player2: "Spieler 2",
    topic: "Thema",
    defaultTopic: "Wer ist der Grosste aller Zeiten?",
    startBattle: "DEBATTE STARTEN",
    generating: "DEBATTE WIRD ERSTELLT...",
    judgesVerdict: "Richterurteil",
    whoWon: "Wer hat deiner Meinung nach gewonnen?",
    vote: "Abstimmen fur",
    votedFor: "Abgestimmt fur",
    rematch: "REVANCHE",
    limitTitle: "TAGESLIMIT ERREICHT",
    limitSubtitle: "Du hast dein kostenloses Debate fur heute benutzt.",
    limitComeBack: "Komm morgen fur ein weiteres kostenloses Debate zuruck.",
    limitComingSoon: "UPGRADE MIT EINEM BEZAHLTEN PLAN",
    limitComingSoonDesc: "Erstelle ein Konto oder melde dich an fur monatliche Credits.",
    billingTitle: "Mitgliedszugang",
    billingSubtitle: "Nutze Email und Passwort fur Credits, Abos und Recovery.",
    signedInAs: "Angemeldet als",
    creditsExpire: "Lauft ab",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Passwort eingeben",
    signInAction: "Anmelden",
    createAccountAction: "Konto Erstellen",
    forgotPassword: "Passwort Vergessen",
    resetPasswordAction: "Reset Link Senden",
    updatePasswordAction: "Neues Passwort Speichern",
    signInHint: "Melde dich an, bevor du einen Plan kaufst oder Credits verwaltest.",
    signUpHint: "Erstelle ein Konto. Supabase kann Bestatigung und Recovery verwalten.",
    resetPasswordHint: "Gib deine Email ein und Supabase sendet einen Reset Link.",
    updatePasswordHint: "Wahle ein neues Passwort fur die Recovery.",
    backToSignIn: "Zuruck zur Anmeldung",
    accountAction: "Konto",
    backToArena: "Zuruck zur Arena",
    signOut: "Abmelden",
    subscribeNow: "Abonnieren",
    managePlan: "Plan Verwalten",
    loadingBilling: "Ladt...",
  },
  fr: {
    ...baseEnglish,
    epicDebateBattle: "Grand Debat",
    player1: "Joueur 1",
    player2: "Joueur 2",
    topic: "Sujet",
    startBattle: "DEMARRER LE DEBAT",
    generating: "GENERATION EN COURS...",
    judgesVerdict: "Verdict du Juge",
    winner: "Gagnant",
    continueBtn: "CONTINUER",
    whoWon: "Qui pensez-vous a gagne ?",
    vote: "Voter pour",
    votedFor: "Vous avez vote pour",
    rematch: "REVANCHE",
    limitTitle: "LIMITE QUOTIDIENNE ATTEINTE",
    limitSubtitle: "Vous avez utilise votre debat gratuit pour aujourd'hui.",
    limitComeBack: "Revenez demain pour un autre debat gratuit.",
    limitComingSoon: "PASSER A UN PLAN PAYANT",
    limitComingSoonDesc: "Creez un compte ou connectez-vous pour debloquer des credits mensuels.",
    billingTitle: "Acces Membre",
    billingSubtitle: "Utilisez email et mot de passe pour credits, abonnements et recovery.",
    signedInAs: "Connecte en tant que",
    passwordLabel: "Mot de Passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    signInAction: "Connexion",
    createAccountAction: "Creer un Compte",
    forgotPassword: "Mot de Passe Oublie",
    resetPasswordAction: "Envoyer le Lien",
    updatePasswordAction: "Enregistrer le Nouveau Mot de Passe",
    signInHint: "Connectez-vous avant d'acheter un plan ou gerer vos credits.",
    signUpHint: "Creez un compte. Supabase peut gerer confirmation et recovery.",
    resetPasswordHint: "Entrez votre email et Supabase enverra un lien de reinitialisation.",
    updatePasswordHint: "Choisissez un nouveau mot de passe pour finir la recovery.",
    backToSignIn: "Retour a la Connexion",
    accountAction: "Compte",
    backToArena: "Retour a l'Arena",
    signOut: "Deconnexion",
    subscribeNow: "S'abonner",
    managePlan: "Gerer le Plan",
    loadingBilling: "Chargement...",
  },
  ru: {
    ...baseEnglish,
  },
};
