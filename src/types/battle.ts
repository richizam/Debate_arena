export type SpeakerId = "a" | "b";

export interface Fighter {
  id: SpeakerId;
  name: string;
  persona: string;
}

export interface DebateLine {
  speaker: SpeakerId;
  text: string;
}

export interface JudgeVerdict {
  winner: SpeakerId;
  reason: string;
}

export interface Battle {
  topic: string;
  fighters: [Fighter, Fighter];
  rounds: DebateLine[];
  judge: JudgeVerdict;
}

export type GamePhase = "intro" | "loading" | "vs" | "debate" | "judge" | "result" | "limit";

export type Language = "en" | "es" | "de" | "fr" | "ru";
