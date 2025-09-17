import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { GameStats } from "../GameStats";
import type { GameStats as GameStatsType } from "../../types/card";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe("GameStats", () => {
  const mockStats: GameStatsType = {
    valueMatches: 5,
    suitMatches: 3,
    totalCards: 52,
  };

  it("should render game stats when game is complete", () => {
    render(
      <TestWrapper>
        <GameStats stats={mockStats} isGameComplete={true} />
      </TestWrapper>
    );

    expect(screen.getByText("Game Complete 🎉")).toBeInTheDocument();
    expect(screen.getByText("Value Matches")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Suit Matches")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Total cards drawn: 52")).toBeInTheDocument();
  });

  it("should not render when game is not complete", () => {
    const { container } = render(
      <TestWrapper>
        <GameStats stats={mockStats} isGameComplete={false} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render zero stats correctly", () => {
    const zeroStats: GameStatsType = {
      valueMatches: 0,
      suitMatches: 0,
      totalCards: 52,
    };

    render(
      <TestWrapper>
        <GameStats stats={zeroStats} isGameComplete={true} />
      </TestWrapper>
    );

    expect(screen.getByText("Value Matches")).toBeInTheDocument();
    expect(screen.getByText("Suit Matches")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2); // Both value and suit matches are 0
  });
});
