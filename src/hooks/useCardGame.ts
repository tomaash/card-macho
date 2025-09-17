import { useState, useCallback, useEffect } from "react";
import type { Card, Deck, GameState } from "../types/card";
import { SnapType } from "../types/card";
import { useDeckAPI } from "./useDeckAPI";

export const useCardGame = () => {
  const { createShuffledDeck, drawCard, isLoading, error } = useDeckAPI();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentCard: null,
    previousCard: null,
    snapType: SnapType.NONE,
    stats: {
      valueMatches: 0,
      suitMatches: 0,
      totalCards: 0,
    },
    isGameComplete: false,
  });

  const initializeGame = useCallback(async () => {
    const newDeck = await createShuffledDeck();
    if (newDeck) {
      setDeck(newDeck);
      setGameState({
        currentCard: null,
        previousCard: null,
        snapType: SnapType.NONE,
        stats: {
          valueMatches: 0,
          suitMatches: 0,
          totalCards: 0,
        },
        isGameComplete: false,
      });
    }
  }, [createShuffledDeck]);

  const checkForMatches = useCallback(
    (currentCard: Card, previousCard: Card | null): SnapType => {
      if (!previousCard) return SnapType.NONE;

      const valueMatch = currentCard.value === previousCard.value;
      const suitMatch = currentCard.suit === previousCard.suit;

      if (valueMatch && suitMatch) {
        return SnapType.BOTH;
      }
      if (valueMatch) {
        return SnapType.VALUE;
      }
      if (suitMatch) {
        return SnapType.SUIT;
      }

      return SnapType.NONE;
    },
    []
  );

  const drawNextCard = useCallback(async () => {
    if (!deck || gameState.isGameComplete) return;

    const response = await drawCard(deck.deck_id);
    if (!response || response.cards.length === 0) return;

    const newCard = response.cards[0];
    const snapType = checkForMatches(newCard, gameState.currentCard);

    setGameState((prevState) => {
      const newStats = { ...prevState.stats };
      newStats.totalCards += 1;

      if (prevState.currentCard) {
        if (newCard.value === prevState.currentCard.value) {
          newStats.valueMatches += 1;
        }
        if (newCard.suit === prevState.currentCard.suit) {
          newStats.suitMatches += 1;
        }
      }

      const isGameComplete = response.remaining === 0;

      return {
        currentCard: newCard,
        previousCard: prevState.currentCard,
        snapType,
        stats: newStats,
        isGameComplete,
      };
    });

    // Update deck remaining count
    setDeck((prevDeck) =>
      prevDeck ? { ...prevDeck, remaining: response.remaining } : null
    );
  }, [
    deck,
    gameState.isGameComplete,
    gameState.currentCard,
    drawCard,
    checkForMatches,
  ]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Clear snap message after 3 seconds
  useEffect(() => {
    if (gameState.snapType !== SnapType.NONE) {
      const timer = setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          snapType: SnapType.NONE,
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState.snapType]);

  return {
    gameState,
    deck,
    initializeGame,
    drawNextCard,
    resetGame,
    isLoading,
    error,
    canDrawCard:
      deck !== null && !gameState.isGameComplete && deck.remaining > 0,
  };
};
