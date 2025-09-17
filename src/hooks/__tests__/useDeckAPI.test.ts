import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDeckAPI } from "../useDeckAPI";

const mockFetch = vi.mocked(fetch);

describe("useDeckAPI", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("createShuffledDeck", () => {
    it("should create a shuffled deck successfully", async () => {
      const mockResponse = {
        success: true,
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 52,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useDeckAPI());

      const deck = await result.current.createShuffledDeck();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      expect(deck).toEqual({
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 52,
      });
      expect(result.current.error).toBeNull();
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() => useDeckAPI());

      const deck = await result.current.createShuffledDeck();

      expect(deck).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe("Failed to create deck: 500");
      });
    });

    it("should handle unsuccessful API response", async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useDeckAPI());

      const deck = await result.current.createShuffledDeck();

      expect(deck).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe("API returned unsuccessful response");
      });
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useDeckAPI());

      const deck = await result.current.createShuffledDeck();

      expect(deck).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
      });
    });
  });

  describe("drawCard", () => {
    it("should draw a card successfully", async () => {
      const mockCard = {
        code: "AS",
        image: "https://example.com/AS.png",
        images: {
          svg: "https://example.com/AS.svg",
          png: "https://example.com/AS.png",
        },
        value: "ACE",
        suit: "SPADES",
      };

      const mockResponse = {
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard],
        remaining: 51,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useDeckAPI());

      const response = await result.current.drawCard("test-deck-id");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://deckofcardsapi.com/api/deck/test-deck-id/draw/?count=1"
      );
      expect(response).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });

    it("should handle draw card errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const { result } = renderHook(() => useDeckAPI());

      const response = await result.current.drawCard("invalid-deck-id");

      expect(response).toBeNull();
      await waitFor(() => {
        expect(result.current.error).toBe("Failed to draw card: 404");
      });
    });
  });

  describe("loading states", () => {
    it("should set loading state during API calls", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(promise as any);

      const { result } = renderHook(() => useDeckAPI());

      expect(result.current.isLoading).toBe(false);

      const deckPromise = result.current.createShuffledDeck();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      resolvePromise!({
        ok: true,
        json: async () => ({
          success: true,
          deck_id: "test",
          shuffled: true,
          remaining: 52,
        }),
      });

      await deckPromise;

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
