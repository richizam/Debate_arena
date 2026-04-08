import type { Language } from "../types/battle";

export const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "ru", flag: "🇷🇺", label: "RU" },
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
    next: "NEXT ▶",
    judgeVerdictBtn: "JUDGE VERDICT ▶",
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
    limitOr: "— OR —",
    limitBuy: "BUY 100 DEBATES — $3.99",
    limitBack: "BACK",
  },
  es: {
    epicDebateBattle: "Gran Debate",
    player1: "Jugador 1",
    player2: "Jugador 2",
    topic: "Tema",
    defaultTopic: "¿Quién es el mejor de todos los tiempos?",
    startBattle: "INICIAR DEBATE",
    generating: "GENERANDO DEBATE...",
    next: "SIGUIENTE ▶",
    judgeVerdictBtn: "VEREDICTO ▶",
    judgesVerdict: "Veredicto del Juez",
    winner: "Ganador",
    continueBtn: "CONTINUAR",
    whoWon: "¿Quién crees que ganó?",
    vote: "Votar por",
    votedFor: "Votaste por",
    rematch: "REVANCHA",
    limitTitle: "LÍMITE DIARIO ALCANZADO",
    limitSubtitle: "Ya usaste tu debate gratuito de hoy.",
    limitComeBack: "Vuelve mañana para otro debate gratis.",
    limitOr: "— O —",
    limitBuy: "COMPRAR 100 DEBATES — $3.99",
    limitBack: "VOLVER",
  },
  de: {
    epicDebateBattle: "Epische Debatte",
    player1: "Spieler 1",
    player2: "Spieler 2",
    topic: "Thema",
    defaultTopic: "Wer ist der Größte aller Zeiten?",
    startBattle: "DEBATTE STARTEN",
    generating: "DEBATTE WIRD ERSTELLT...",
    next: "WEITER ▶",
    judgeVerdictBtn: "URTEIL ▶",
    judgesVerdict: "Richterurteil",
    winner: "Gewinner",
    continueBtn: "WEITER",
    whoWon: "Wer hat deiner Meinung nach gewonnen?",
    vote: "Abstimmen für",
    votedFor: "Abgestimmt für",
    rematch: "REVANCHE",
    limitTitle: "TAGESLIMIT ERREICHT",
    limitSubtitle: "Du hast dein kostenloses Debate für heute verwendet.",
    limitComeBack: "Komm morgen für ein weiteres kostenloses Debate zurück.",
    limitOr: "— ODER —",
    limitBuy: "100 DEBATTEN KAUFEN — $3.99",
    limitBack: "ZURÜCK",
  },
  fr: {
    epicDebateBattle: "Grand Débat",
    player1: "Joueur 1",
    player2: "Joueur 2",
    topic: "Sujet",
    defaultTopic: "Qui est le meilleur de tous les temps ?",
    startBattle: "DÉMARRER LE DÉBAT",
    generating: "GÉNÉRATION EN COURS...",
    next: "SUIVANT ▶",
    judgeVerdictBtn: "VERDICT ▶",
    judgesVerdict: "Verdict du Juge",
    winner: "Gagnant",
    continueBtn: "CONTINUER",
    whoWon: "Qui pensez-vous a gagné ?",
    vote: "Voter pour",
    votedFor: "Vous avez voté pour",
    rematch: "REVANCHE",
    limitTitle: "LIMITE QUOTIDIENNE ATTEINTE",
    limitSubtitle: "Vous avez utilisé votre débat gratuit pour aujourd'hui.",
    limitComeBack: "Revenez demain pour un autre débat gratuit.",
    limitOr: "— OU —",
    limitBuy: "ACHETER 100 DÉBATS — 3,99 $",
    limitBack: "RETOUR",
  },
  ru: {
    epicDebateBattle: "Эпический Дебат",
    player1: "Игрок 1",
    player2: "Игрок 2",
    topic: "Тема",
    defaultTopic: "Кто лучший из всех времён?",
    startBattle: "НАЧАТЬ ДЕБАТЫ",
    generating: "ГЕНЕРАЦИЯ ДЕБАТОВ...",
    next: "ДАЛЕЕ ▶",
    judgeVerdictBtn: "ВЕРДИКТ ▶",
    judgesVerdict: "Вердикт Судьи",
    winner: "Победитель",
    continueBtn: "ПРОДОЛЖИТЬ",
    whoWon: "Кто, по-вашему, победил?",
    vote: "Голосовать за",
    votedFor: "Проголосовали за",
    rematch: "РЕВАНШ",
    limitTitle: "ДНЕВНОЙ ЛИМИТ ИСЧЕРПАН",
    limitSubtitle: "Вы использовали бесплатный дебат на сегодня.",
    limitComeBack: "Возвращайтесь завтра за новым бесплатным дебатом.",
    limitOr: "— ИЛИ —",
    limitBuy: "КУПИТЬ 100 ДЕБАТОВ — $3.99",
    limitBack: "НАЗАД",
  },
};
