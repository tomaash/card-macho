import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Card } from "../Card";
import type { Card as CardType } from "../../types/card";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe("Card", () => {
  const mockCard: CardType = {
    code: "AS",
    image: "https://example.com/AS.png",
    images: {
      svg: "https://example.com/AS.svg",
      png: "https://example.com/AS.png",
    },
    value: "ACE",
    suit: "SPADES",
  };

  it("should render a card with correct alt text and image source", () => {
    render(
      <TestWrapper>
        <Card card={mockCard} />
      </TestWrapper>
    );

    const image = screen.getByAltText("ACE of SPADES");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/AS.png");
  });

  it("should render placeholder with custom label", () => {
    render(
      <TestWrapper>
        <Card isPlaceholder={true} label="Test Placeholder" />
      </TestWrapper>
    );

    expect(screen.getByText("Test Placeholder")).toBeInTheDocument();
  });

  it("should render placeholder with default label when no label provided", () => {
    render(
      <TestWrapper>
        <Card isPlaceholder={true} />
      </TestWrapper>
    );

    expect(screen.getByText("No Card")).toBeInTheDocument();
  });

  it("should not render anything when no card and not placeholder", () => {
    const { container } = render(
      <TestWrapper>
        <Card />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render card image element", () => {
    render(
      <TestWrapper>
        <Card card={mockCard} />
      </TestWrapper>
    );

    const image = screen.getByAltText("ACE of SPADES");
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe("IMG");
  });
});
