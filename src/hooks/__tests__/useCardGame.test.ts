import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCardGame } from "../useCardGame";
import * as deckAPI from "../useDeckAPI";
import { SnapType } from "../../types/card";

// Mock the useDeckAPI hook
vi.mock("../useDeckAPI");

const mockUseDeckAPI = vi.mocked(deckAPI.useDeckAPI);

describe("useCardGame", () => {
  const mockCreateShuffledDeck = vi.fn();
  const mockDrawCard = vi.fn();

  beforeEach(() => {
    mockCreateShuffledDeck.mockClear();
    mockDrawCard.mockClear();

    mockUseDeckAPI.mockReturnValue({
      createShuffledDeck: mockCreateShuffledDeck,
      drawCard: mockDrawCard,
      isLoading: false,
      error: null,
    });
  });

  describe("initializeGame", () => {
    it("should initialize the game with a new deck", async () => {
      const mockDeck = {
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 52,
      };

      mockCreateShuffledDeck.mockResolvedValueOnce(mockDeck);

      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      expect(mockCreateShuffledDeck).toHaveBeenCalled();
      expect(result.current.deck).toEqual(mockDeck);
      expect(result.current.gameState.currentCard).toBeNull();
      expect(result.current.gameState.previousCard).toBeNull();
      expect(result.current.gameState.stats.valueMatches).toBe(0);
      expect(result.current.gameState.stats.suitMatches).toBe(0);
      expect(result.current.gameState.isGameComplete).toBe(false);
    });

    it("should handle deck creation failure", async () => {
      mockCreateShuffledDeck.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      expect(result.current.deck).toBeNull();
    });
  });

  describe("drawNextCard", () => {
    const mockCard1 = {
      code: "AS",
      image: "https://example.com/AS.png",
      images: { svg: "svg", png: "png" },
      value: "ACE",
      suit: "SPADES",
    };

    const mockCard2 = {
      code: "AH",
      image: "https://example.com/AH.png",
      images: { svg: "svg", png: "png" },
      value: "ACE",
      suit: "HEARTS",
    };

    beforeEach(() => {
      const mockDeck = {
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 52,
      };
      mockCreateShuffledDeck.mockResolvedValueOnce(mockDeck);
    });

    it("should draw the first card", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      const mockResponse = {
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 51,
      };

      mockDrawCard.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(result.current.gameState.currentCard).toEqual(mockCard1);
      expect(result.current.gameState.previousCard).toBeNull();
      expect(result.current.gameState.snapType).toBe(SnapType.NONE);
      expect(result.current.gameState.stats.totalCards).toBe(1);
    });

    it("should detect value match", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      // Draw first card
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 51,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      // Draw second card with same value
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard2],
        remaining: 50,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(result.current.gameState.currentCard).toEqual(mockCard2);
      expect(result.current.gameState.previousCard).toEqual(mockCard1);
      expect(result.current.gameState.snapType).toBe(SnapType.VALUE);
      expect(result.current.gameState.stats.valueMatches).toBe(1);
      expect(result.current.gameState.stats.suitMatches).toBe(0);
      expect(result.current.gameState.stats.totalCards).toBe(2);
    });

    it("should detect suit match", async () => {
      const mockCard3 = {
        code: "KS",
        image: "https://example.com/KS.png",
        images: { svg: "svg", png: "png" },
        value: "KING",
        suit: "SPADES",
      };

      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      // Draw first card
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 51,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      // Draw second card with same suit
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard3],
        remaining: 50,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(result.current.gameState.snapType).toBe(SnapType.SUIT);
      expect(result.current.gameState.stats.valueMatches).toBe(0);
      expect(result.current.gameState.stats.suitMatches).toBe(1);
    });

    it("should detect value match when both value and suit match", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      // Draw first card
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 51,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      // Draw same card (both value and suit match, but value takes priority)
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 50,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(result.current.gameState.snapType).toBe(SnapType.VALUE);
      expect(result.current.gameState.stats.valueMatches).toBe(1);
      expect(result.current.gameState.stats.suitMatches).toBe(1);
    });

    it("should complete game when deck is empty", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 0,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(result.current.gameState.isGameComplete).toBe(true);
      expect(result.current.canDrawCard).toBe(false);
    });

    it("should not draw card when game is complete", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      // Complete the game
      mockDrawCard.mockResolvedValueOnce({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 0,
      });

      await act(async () => {
        await result.current.drawNextCard();
      });

      // Try to draw another card
      mockDrawCard.mockClear();

      await act(async () => {
        await result.current.drawNextCard();
      });

      expect(mockDrawCard).not.toHaveBeenCalled();
    });
  });

  describe("resetGame", () => {
    it("should call resetGame without error", async () => {
      const { result } = renderHook(() => useCardGame());

      await act(async () => {
        await result.current.initializeGame();
      });

      // Reset the game
      mockCreateShuffledDeck.mockResolvedValueOnce({
        deck_id: "new-deck-id",
        shuffled: true,
        remaining: 52,
      });

      await act(async () => {
        await result.current.resetGame();
      });

      // Just verify the function can be called without throwing
      expect(result.current.resetGame).toBeDefined();
    });
  });
});
