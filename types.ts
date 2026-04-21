
export interface Word {
  id: string;
  en: string;
  uz: string;
  imageUrl?: string;
}

export interface Unit {
  id: string;
  title: string;
  icon: string;
  words: Word[];
}

export interface Tense {
  id: string;
  title: string;
  formula: string;
  example: string;
  description: string;
}

export type Language = 'uz' | 'en';

export enum GameMode {
  IDLE = 'IDLE',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  MATCH = 'MATCH',
  WRITTEN = 'WRITTEN',
  SCRAMBLE = 'SCRAMBLE',
  EXAM = 'EXAM',
  GLOBAL_EXAM = 'GLOBAL_EXAM',
  PRACTICE_EN_UZ = 'PRACTICE_EN_UZ',
  PRACTICE_UZ_EN = 'PRACTICE_UZ_EN',
  SPRINT = 'SPRINT',
  VOICE_EN_UZ = 'VOICE_EN_UZ',
  VOICE_UZ_EN = 'VOICE_UZ_EN',
  PRONUNCIATION = 'PRONUNCIATION'
}
