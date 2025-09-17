export interface Card {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

export interface Deck {
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface DrawResponse {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
}

export const SnapType = {
  NONE: "NONE",
  VALUE: "VALUE",
  SUIT: "SUIT",
  BOTH: "BOTH",
} as const;

export type SnapType = (typeof SnapType)[keyof typeof SnapType];

export interface GameStats {
  valueMatches: number;
  suitMatches: number;
  totalCards: number;
}

export interface GameState {
  currentCard: Card | null;
  previousCard: Card | null;
  snapType: SnapType;
  stats: GameStats;
  isGameComplete: boolean;
}
