import type { Language } from "../types/battle";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
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
  suggestionsHeading: string;
  liveTag: string;
  limitCountdownLabel: string;
  limitShareCta: string;
  limitShareLabel: string;
  limitShareTweet: string;
  limitShareOfferTitle: string;
  limitShareOfferDesc: string;
  limitShareSuccess: string;
  limitPlayNow: string;
  resultShareLabel: string;
  resultShareSuccess: string;
  muteSound: string;
  unmuteSound: string;
  sharedViewBanner: string;
  startYourOwnDebate: string;
  loadingSharedBattle: string;
  sharedBattleNotFound: string;
  toneHeading: string;
  toneCivil: string;
  toneCivilDesc: string;
  toneHeated: string;
  toneHeatedDesc: string;
  toneSavage: string;
  toneSavageDesc: string;
  proLiveLabel: string;
  proLiveBadge: string;
  proLiveDesc: string;
  proLiveLockedDesc: string;
  proLiveOutOfCredits: string;
  proLiveLoading: string;
  premiumCreditsRemaining: string;
  aiDisclaimer: string;
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
  suggestionsHeading: "Pick a battle to start fast",
  liveTag: "LIVE",
  limitCountdownLabel: "Next free debate in",
  limitShareCta: "Bring a friend, fight again",
  limitShareLabel: "SHARE ON X",
  limitShareTweet: "I just made two AIs fight on Debate Arena. Pick your champion:",
  limitShareOfferTitle: "Share now, fight again now",
  limitShareOfferDesc: "Post Debate Arena on X and unlock one extra free debate today.",
  limitShareSuccess: "Free debate unlocked. Tap PLAY NOW to fight.",
  limitPlayNow: "PLAY NOW",
  resultShareLabel: "SHARE ON X",
  resultShareSuccess: "Shared! Free debate unlocked for later.",
  muteSound: "Mute sound",
  unmuteSound: "Unmute sound",
  sharedViewBanner: "Someone shared this battle with you",
  startYourOwnDebate: "START YOUR OWN DEBATE",
  loadingSharedBattle: "Loading the shared battle...",
  sharedBattleNotFound: "This shared battle is no longer available.",
  toneHeading: "Tone",
  toneCivil: "CIVIL",
  toneCivilDesc: "Formal, respectful disagreement",
  toneHeated: "HEATED",
  toneHeatedDesc: "Sports-radio energy. Sharp insults, no profanity",
  toneSavage: "SAVAGE",
  toneSavageDesc: "Roast-battle mode. Mild profanity allowed",
  proLiveLabel: "PRO LIVE",
  proLiveBadge: "PRO",
  proLiveDesc: "Searches X and the live web. Costs 1 premium credit. Takes 20–30 seconds.",
  proLiveLockedDesc: "Sign in with a paid plan to unlock Pro Live (X + live web search).",
  proLiveOutOfCredits: "No Pro Live credits remaining this month.",
  proLiveLoading: "Researching X and the live web in real time… this takes 20–30 seconds for the deepest context.",
  premiumCreditsRemaining: "Pro Credits",
  aiDisclaimer: "Debates are AI-generated and may contain errors, fabricated quotes, or fictional details. For entertainment only.",
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
    suggestionsHeading: "Elige una batalla para empezar ya",
    liveTag: "EN VIVO",
    toneHeading: "Tono",
    toneCivil: "CIVIL",
    toneCivilDesc: "Desacuerdo formal y respetuoso",
    toneHeated: "INTENSO",
    toneHeatedDesc: "Energia de radio deportiva. Insultos filosos, sin groserias",
    toneSavage: "SALVAJE",
    toneSavageDesc: "Modo roast. Groserias suaves permitidas",
    proLiveLabel: "PRO LIVE",
    proLiveBadge: "PRO",
    proLiveDesc: "Busca en X y la web en tiempo real. Cuesta 1 credito Pro. Tarda 20-30 segundos.",
    proLiveLockedDesc: "Inicia sesion con plan de pago para desbloquear Pro Live (X + web en vivo).",
    proLiveOutOfCredits: "No te quedan creditos Pro Live este mes.",
    proLiveLoading: "Investigando X y la web en tiempo real... toma 20-30 segundos para el contexto mas profundo.",
    premiumCreditsRemaining: "Creditos Pro",
    aiDisclaimer: "Los debates son generados por IA y pueden contener errores, citas inventadas o detalles ficticios. Solo para entretenimiento.",
    limitCountdownLabel: "Tu proximo debate gratis en",
    limitShareCta: "Trae a un amigo, vuelve a pelear",
    limitShareLabel: "COMPARTIR EN X",
    limitShareTweet: "Hice pelear a dos IAs en Debate Arena. Elige a tu campeon:",
    limitShareOfferTitle: "Comparte ahora, pelea ahora",
    limitShareOfferDesc: "Publica Debate Arena en X y desbloquea un debate gratis extra hoy.",
    limitShareSuccess: "Debate desbloqueado. Pulsa JUGAR YA para empezar.",
    limitPlayNow: "JUGAR YA",
    resultShareLabel: "COMPARTIR EN X",
    resultShareSuccess: "Compartido. Debate gratis desbloqueado para mas tarde.",
    muteSound: "Silenciar sonido",
    unmuteSound: "Activar sonido",
    sharedViewBanner: "Alguien compartio esta batalla contigo",
    startYourOwnDebate: "INICIA TU PROPIO DEBATE",
    loadingSharedBattle: "Cargando la batalla compartida...",
    sharedBattleNotFound: "Esta batalla ya no esta disponible.",
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
    suggestionsHeading: "Waehle eine Debatte zum Schnellstart",
    liveTag: "LIVE",
    limitCountdownLabel: "Naechste freie Debatte in",
    limitShareCta: "Bring einen Freund, kaempf erneut",
    limitShareLabel: "AUF X TEILEN",
    limitShareTweet: "Ich habe zwei KIs auf Debate Arena gegeneinander antreten lassen. Waehl deinen Champion:",
    limitShareOfferTitle: "Jetzt teilen, jetzt weiterkaempfen",
    limitShareOfferDesc: "Teile Debate Arena auf X und schalte heute eine extra freie Debatte frei.",
    limitShareSuccess: "Debatte freigeschaltet. Tippe auf JETZT SPIELEN.",
    limitPlayNow: "JETZT SPIELEN",
    resultShareLabel: "AUF X TEILEN",
    resultShareSuccess: "Geteilt. Freie Debatte fuer spaeter freigeschaltet.",
    muteSound: "Ton stummschalten",
    unmuteSound: "Ton aktivieren",
    sharedViewBanner: "Jemand hat diese Debatte mit dir geteilt",
    startYourOwnDebate: "STARTE DEINE EIGENE DEBATTE",
    loadingSharedBattle: "Geteilte Debatte wird geladen...",
    sharedBattleNotFound: "Diese geteilte Debatte ist nicht mehr verfuegbar.",
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
    suggestionsHeading: "Choisissez un debat pour demarrer vite",
    liveTag: "EN DIRECT",
    limitCountdownLabel: "Prochain debat gratuit dans",
    limitShareCta: "Amene un ami, reviens te battre",
    limitShareLabel: "PARTAGER SUR X",
    limitShareTweet: "J'ai fait combattre deux IA sur Debate Arena. Choisis ton champion :",
    limitShareOfferTitle: "Partage, rejoue tout de suite",
    limitShareOfferDesc: "Partage Debate Arena sur X et debloque un debat gratuit supplementaire aujourd'hui.",
    limitShareSuccess: "Debat debloque. Touche JOUER MAINTENANT.",
    limitPlayNow: "JOUER MAINTENANT",
    resultShareLabel: "PARTAGER SUR X",
    resultShareSuccess: "Partage. Debat gratuit debloque pour plus tard.",
    muteSound: "Couper le son",
    unmuteSound: "Activer le son",
    sharedViewBanner: "Quelqu'un a partage ce debat avec toi",
    startYourOwnDebate: "LANCE TON PROPRE DEBAT",
    loadingSharedBattle: "Chargement du debat partage...",
    sharedBattleNotFound: "Ce debat partage n'est plus disponible.",
  },
  ru: {
    ...baseEnglish,
    epicDebateBattle: "Эпический Дебат",
    player1: "Игрок 1",
    player2: "Игрок 2",
    topic: "Тема",
    defaultTopic: "Кто величайший всех времён?",
    startBattle: "НАЧАТЬ БОЙ",
    generating: "ГЕНЕРИРУЕМ ДЕБАТ...",
    next: "ДАЛЬШЕ >",
    judgeVerdictBtn: "ВЕРДИКТ СУДЬИ >",
    judgesVerdict: "Вердикт Судьи",
    winner: "Победитель",
    continueBtn: "ПРОДОЛЖИТЬ",
    whoWon: "Как ты думаешь, кто победил?",
    vote: "Голос за",
    votedFor: "Ты проголосовал за",
    rematch: "РЕВАНШ",
    limitTitle: "ДНЕВНОЙ ЛИМИТ ИСЧЕРПАН",
    limitSubtitle: "Ты использовал свой бесплатный дебат на сегодня.",
    limitComeBack: "Возвращайся завтра за новым бесплатным дебатом.",
    limitOr: "ИЛИ",
    limitBuy: "ОТКРЫТЬ ДОСТУП",
    limitBack: "НАЗАД",
    limitComingSoon: "АПГРЕЙД С ПЛАТНЫМ ПЛАНОМ",
    limitComingSoonDesc: "Создай аккаунт или войди, чтобы получить ежемесячные кредиты.",
    billingTitle: "Доступ участника",
    billingSubtitle: "Используй email и пароль для управления кредитами и подпиской.",
    billingUnavailable: "Биллинг ещё не настроен.",
    signedInAs: "Вход выполнен как",
    creditsRemaining: "Кредиты",
    creditsExpire: "Истекает",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Введи пароль",
    signInAction: "Войти",
    createAccountAction: "Создать аккаунт",
    forgotPassword: "Забыл пароль",
    resetPasswordAction: "Отправить ссылку",
    updatePasswordAction: "Сохранить новый пароль",
    signInHint: "Войди перед покупкой плана или управлением кредитами.",
    signUpHint: "Создай аккаунт. Supabase подтвердит email и поможет с восстановлением.",
    resetPasswordHint: "Введи email, и Supabase пришлёт ссылку для восстановления.",
    updatePasswordHint: "Выбери новый пароль, чтобы завершить восстановление.",
    backToSignIn: "Назад к входу",
    accountAction: "Аккаунт",
    backToArena: "Назад в арену",
    signOut: "Выйти",
    subscribeNow: "Подписаться",
    managePlan: "Управлять планом",
    loadingBilling: "Загрузка...",
    suggestionsHeading: "Выбери бой, чтобы начать быстрее",
    liveTag: "В ЭФИРЕ",
    limitCountdownLabel: "Следующий бесплатный дебат через",
    limitShareCta: "Приведи друга, дерись снова",
    limitShareLabel: "ПОДЕЛИТЬСЯ В X",
    limitShareTweet: "Я только что заставил двух ИИ драться на Debate Arena. Выбери своего чемпиона:",
    limitShareOfferTitle: "Поделись сейчас, играй сейчас",
    limitShareOfferDesc: "Опубликуй Debate Arena в X и получи дополнительный бесплатный дебат сегодня.",
    limitShareSuccess: "Дебат разблокирован. Жми ИГРАТЬ.",
    limitPlayNow: "ИГРАТЬ",
    resultShareLabel: "ПОДЕЛИТЬСЯ В X",
    resultShareSuccess: "Готово. Бесплатный дебат разблокирован.",
    muteSound: "Выключить звук",
    unmuteSound: "Включить звук",
    sharedViewBanner: "Кто-то поделился с тобой этим дебатом",
    startYourOwnDebate: "ЗАПУСТИ СВОЙ ДЕБАТ",
    loadingSharedBattle: "Загружаем общий дебат...",
    sharedBattleNotFound: "Этот общий дебат больше недоступен.",
  },
};
