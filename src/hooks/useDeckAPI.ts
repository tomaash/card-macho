import { useState, useCallback } from "react";
import type { Deck, DrawResponse } from "../types/card";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

export const useDeckAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShuffledDeck = useCallback(async (): Promise<Deck | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);

      if (!response.ok) {
        throw new Error(`Failed to create deck: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      return {
        deck_id: data.deck_id,
        shuffled: data.shuffled,
        remaining: data.remaining,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const drawCard = useCallback(
    async (deckId: string): Promise<DrawResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/${deckId}/draw/?count=1`);

        if (!response.ok) {
          throw new Error(`Failed to draw card: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("API returned unsuccessful response");
        }

        return {
          success: data.success,
          deck_id: data.deck_id,
          cards: data.cards,
          remaining: data.remaining,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createShuffledDeck,
    drawCard,
    isLoading,
    error,
  };
};
