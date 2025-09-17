import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "../App";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

const mockFetch = vi.mocked(fetch);

describe("App Integration", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should initialize and display the game interface", async () => {
    const mockDeckResponse = {
      success: true,
      deck_id: "test-deck-id",
      shuffled: true,
      remaining: 52,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeckResponse,
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Card Macho™")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Draw cards and watch for matches!")
    ).toBeInTheDocument();
    expect(screen.getByText(/Cards remaining:/)).toBeInTheDocument();
    expect(screen.getByText("Draw Card")).toBeInTheDocument();
    expect(screen.getByText("Previous Card")).toBeInTheDocument();
    expect(screen.getByText("Current Card")).toBeInTheDocument();
  });

  it("should draw a card and update the interface", async () => {
    const user = userEvent.setup();

    // Mock deck creation
    const mockDeckResponse = {
      success: true,
      deck_id: "test-deck-id",
      shuffled: true,
      remaining: 52,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeckResponse,
    } as Response);

    // Mock card draw
    const mockCard = {
      code: "AS",
      image: "https://deckofcardsapi.com/static/img/AS.png",
      images: {
        svg: "https://deckofcardsapi.com/static/img/AS.svg",
        png: "https://deckofcardsapi.com/static/img/AS.png",
      },
      value: "ACE",
      suit: "SPADES",
    };

    const mockDrawResponse = {
      success: true,
      deck_id: "test-deck-id",
      cards: [mockCard],
      remaining: 51,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDrawResponse,
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Draw Card")).toBeInTheDocument();
    });

    const drawButton = screen.getByText("Draw Card");
    await user.click(drawButton);

    await waitFor(() => {
      expect(screen.getByText(/Cards remaining:/)).toBeInTheDocument();
    });

    expect(screen.getByAltText("ACE of SPADES")).toBeInTheDocument();
  });

  it("should detect and display value match", async () => {
    const user = userEvent.setup();

    // Mock deck creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 52,
      }),
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Draw Card")).toBeInTheDocument();
    });

    // Draw first card
    const mockCard1 = {
      code: "AS",
      image: "https://deckofcardsapi.com/static/img/AS.png",
      images: { svg: "svg", png: "png" },
      value: "ACE",
      suit: "SPADES",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard1],
        remaining: 51,
      }),
    } as Response);

    await user.click(screen.getByText("Draw Card"));

    await waitFor(() => {
      expect(screen.getByAltText("ACE of SPADES")).toBeInTheDocument();
    });

    // Draw second card with same value
    const mockCard2 = {
      code: "AH",
      image: "https://deckofcardsapi.com/static/img/AH.png",
      images: { svg: "svg", png: "png" },
      value: "ACE",
      suit: "HEARTS",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard2],
        remaining: 50,
      }),
    } as Response);

    await user.click(screen.getByText("Draw Card"));

    await waitFor(() => {
      expect(screen.getByText("SNAP VALUE!")).toBeInTheDocument();
    });

    expect(screen.getByAltText("ACE of HEARTS")).toBeInTheDocument();
    expect(screen.getByAltText("ACE of SPADES")).toBeInTheDocument();
  });

  it("should complete the game and show stats", async () => {
    const user = userEvent.setup();

    // Mock deck creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 1,
      }),
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Draw Card")).toBeInTheDocument();
    });

    // Draw last card
    const mockCard = {
      code: "AS",
      image: "https://deckofcardsapi.com/static/img/AS.png",
      images: { svg: "svg", png: "png" },
      value: "ACE",
      suit: "SPADES",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        cards: [mockCard],
        remaining: 0,
      }),
    } as Response);

    await user.click(screen.getByText("Draw Card"));

    await waitFor(() => {
      expect(screen.getByText("Game Complete 🎉")).toBeInTheDocument();
    });

    expect(screen.getByText("Value Matches")).toBeInTheDocument();
    expect(screen.getByText("Suit Matches")).toBeInTheDocument();
    expect(screen.getByText("Total cards drawn: 1")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
    expect(screen.queryByText("Draw Card")).not.toBeInTheDocument();
  });

  it("should handle API errors gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("should reset the game when Play Again is clicked", async () => {
    const user = userEvent.setup();

    // Mock initial deck creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        shuffled: true,
        remaining: 1,
      }),
    } as Response);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Draw Card")).toBeInTheDocument();
    });

    // Complete the game
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "test-deck-id",
        cards: [
          {
            code: "AS",
            image: "https://deckofcardsapi.com/static/img/AS.png",
            images: { svg: "svg", png: "png" },
            value: "ACE",
            suit: "SPADES",
          },
        ],
        remaining: 0,
      }),
    } as Response);

    await user.click(screen.getByText("Draw Card"));

    await waitFor(() => {
      expect(screen.getByText("Play Again")).toBeInTheDocument();
    });

    // Mock new deck creation for reset
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        deck_id: "new-deck-id",
        shuffled: true,
        remaining: 52,
      }),
    } as Response);

    await user.click(screen.getByText("Play Again"));

    await waitFor(() => {
      expect(screen.getByText(/Cards remaining:/)).toBeInTheDocument();
    });

    expect(screen.getByText("Draw Card")).toBeInTheDocument();
    expect(screen.queryByText("Game Complete 🎉")).not.toBeInTheDocument();
  });
});
