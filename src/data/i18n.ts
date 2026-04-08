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
  },
};
