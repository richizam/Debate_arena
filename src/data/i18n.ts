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
  sendMagicLink: string;
  sendingMagicLink: string;
  authHint: string;
  signOut: string;
  subscribeNow: string;
  managePlan: string;
  loadingBilling: string;
}

export const translations: Record<Language, Translations> = {
  en: {
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
    limitComingSoonDesc: "Sign in below to unlock recurring monthly debate credits.",
    billingTitle: "Member Access",
    billingSubtitle: "Sign in to manage credits and subscriptions.",
    billingUnavailable: "Billing login is not configured yet.",
    signedInAs: "Signed in as",
    creditsRemaining: "Credits",
    creditsExpire: "Expires",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "Send Magic Link",
    sendingMagicLink: "Sending Link...",
    authHint: "Use your email to receive a magic link and unlock paid plans.",
    signOut: "Sign Out",
    subscribeNow: "Subscribe",
    managePlan: "Manage Plan",
    loadingBilling: "Loading...",
  },
  es: {
    epicDebateBattle: "Batalla de Debate",
    player1: "Jugador 1",
    player2: "Jugador 2",
    topic: "Tema",
    defaultTopic: "Quien es el mejor de todos los tiempos?",
    startBattle: "INICIAR DEBATE",
    generating: "GENERANDO DEBATE...",
    next: "SIGUIENTE >",
    judgeVerdictBtn: "VEREDICTO >",
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
    limitOr: "O",
    limitBuy: "OBTENER ACCESO MEMBER",
    limitBack: "VOLVER",
    limitComingSoon: "MEJORA CON UN PLAN DE PAGO",
    limitComingSoonDesc: "Inicia sesion abajo para desbloquear creditos mensuales.",
    billingTitle: "Acceso Member",
    billingSubtitle: "Inicia sesion para ver creditos y suscripciones.",
    billingUnavailable: "El login de billing no esta configurado todavia.",
    signedInAs: "Sesion iniciada como",
    creditsRemaining: "Creditos",
    creditsExpire: "Expira",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    sendMagicLink: "Enviar Magic Link",
    sendingMagicLink: "Enviando Link...",
    authHint: "Usa tu email para recibir un magic link y desbloquear planes pagos.",
    signOut: "Cerrar Sesion",
    subscribeNow: "Suscribirse",
    managePlan: "Gestionar Plan",
    loadingBilling: "Cargando...",
  },
  de: {
    epicDebateBattle: "Epische Debatte",
    player1: "Spieler 1",
    player2: "Spieler 2",
    topic: "Thema",
    defaultTopic: "Wer ist der Grosste aller Zeiten?",
    startBattle: "DEBATTE STARTEN",
    generating: "DEBATTE WIRD ERSTELLT...",
    next: "WEITER >",
    judgeVerdictBtn: "URTEIL >",
    judgesVerdict: "Richterurteil",
    winner: "Gewinner",
    continueBtn: "WEITER",
    whoWon: "Wer hat deiner Meinung nach gewonnen?",
    vote: "Abstimmen fur",
    votedFor: "Abgestimmt fur",
    rematch: "REVANCHE",
    limitTitle: "TAGESLIMIT ERREICHT",
    limitSubtitle: "Du hast dein kostenloses Debate fur heute benutzt.",
    limitComeBack: "Komm morgen fur ein weiteres kostenloses Debate zuruck.",
    limitOr: "ODER",
    limitBuy: "MITGLIEDSCHAFT HOLEN",
    limitBack: "ZURUCK",
    limitComingSoon: "UPGRADE MIT EINEM BEZAHLTEN PLAN",
    limitComingSoonDesc: "Melde dich unten an, um monatliche Credits freizuschalten.",
    billingTitle: "Mitgliedszugang",
    billingSubtitle: "Melde dich an, um Credits und Abos zu verwalten.",
    billingUnavailable: "Billing Login ist noch nicht konfiguriert.",
    signedInAs: "Angemeldet als",
    creditsRemaining: "Credits",
    creditsExpire: "Lauft ab",
    emailLabel: "Email",
    emailPlaceholder: "du@example.com",
    sendMagicLink: "Magic Link senden",
    sendingMagicLink: "Link wird gesendet...",
    authHint: "Nutze deine Email fur einen Magic Link und bezahlte Plane.",
    signOut: "Abmelden",
    subscribeNow: "Abonnieren",
    managePlan: "Plan verwalten",
    loadingBilling: "Ladt...",
  },
  fr: {
    epicDebateBattle: "Grand Debat",
    player1: "Joueur 1",
    player2: "Joueur 2",
    topic: "Sujet",
    defaultTopic: "Qui est le meilleur de tous les temps ?",
    startBattle: "DEMARRER LE DEBAT",
    generating: "GENERATION EN COURS...",
    next: "SUIVANT >",
    judgeVerdictBtn: "VERDICT >",
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
    limitOr: "OU",
    limitBuy: "OBTENIR L'ACCES MEMBRE",
    limitBack: "RETOUR",
    limitComingSoon: "PASSER A UN PLAN PAYANT",
    limitComingSoonDesc: "Connectez-vous ci-dessous pour debloquer des credits mensuels.",
    billingTitle: "Acces Membre",
    billingSubtitle: "Connectez-vous pour gerer credits et abonnements.",
    billingUnavailable: "La connexion billing n'est pas encore configuree.",
    signedInAs: "Connecte en tant que",
    creditsRemaining: "Credits",
    creditsExpire: "Expire",
    emailLabel: "Email",
    emailPlaceholder: "vous@example.com",
    sendMagicLink: "Envoyer Magic Link",
    sendingMagicLink: "Envoi du Link...",
    authHint: "Utilisez votre email pour recevoir un magic link et debloquer les plans payants.",
    signOut: "Deconnexion",
    subscribeNow: "S'abonner",
    managePlan: "Gerer le Plan",
    loadingBilling: "Chargement...",
  },
  ru: {
    epicDebateBattle: "Debate Arena",
    player1: "Player 1",
    player2: "Player 2",
    topic: "Topic",
    defaultTopic: "Who is the greatest of all time?",
    startBattle: "START BATTLE",
    generating: "GENERATING DEBATE...",
    next: "NEXT >",
    judgeVerdictBtn: "JUDGE VERDICT >",
    judgesVerdict: "Judge Verdict",
    winner: "Winner",
    continueBtn: "CONTINUE",
    whoWon: "Who do you think won?",
    vote: "Vote",
    votedFor: "Voted for",
    rematch: "REMATCH",
    limitTitle: "DAILY LIMIT REACHED",
    limitSubtitle: "You used today's free debate.",
    limitComeBack: "Come back tomorrow for another free debate.",
    limitOr: "OR",
    limitBuy: "GET MEMBER ACCESS",
    limitBack: "BACK",
    limitComingSoon: "UPGRADE WITH A PAID PLAN",
    limitComingSoonDesc: "Sign in below to unlock recurring monthly credits.",
    billingTitle: "Member Access",
    billingSubtitle: "Sign in to manage credits and subscriptions.",
    billingUnavailable: "Billing login is not configured yet.",
    signedInAs: "Signed in as",
    creditsRemaining: "Credits",
    creditsExpire: "Expires",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "Send Magic Link",
    sendingMagicLink: "Sending Link...",
    authHint: "Use your email to receive a magic link and unlock paid plans.",
    signOut: "Sign Out",
    subscribeNow: "Subscribe",
    managePlan: "Manage Plan",
    loadingBilling: "Loading...",
  },
};
