import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { SnapMessage } from "../SnapMessage";
import { SnapType } from "../../types/card";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe("SnapMessage", () => {
  it("should render value snap message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.VALUE} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP VALUE!")).toBeInTheDocument();
  });

  it("should render suit snap message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.SUIT} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP SUIT!")).toBeInTheDocument();
  });

  it("should render both value and suit snap message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.BOTH} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP VALUE! SNAP SUIT!")).toBeInTheDocument();
  });

  it("should not render when message is empty", () => {
    const { container } = render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.NONE} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should remove the message after fade-out animation", () => {
    const { rerender } = render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.VALUE} />
      </TestWrapper>
    );

    const messageBox = screen.getByText("SNAP VALUE!");
    expect(messageBox).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <SnapMessage snapType={SnapType.NONE} />
      </TestWrapper>
    );

    // Message should still be visible
    expect(screen.getByText("SNAP VALUE!")).toBeInTheDocument();

    // Fire the animation end event
    fireEvent.animationEnd(messageBox);

    // Now the message should be gone
    expect(screen.queryByText("SNAP VALUE!")).not.toBeInTheDocument();
  });

  it("should render value snap with correct message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.VALUE} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP VALUE!")).toBeInTheDocument();
  });

  it("should render suit snap with correct message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.SUIT} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP SUIT!")).toBeInTheDocument();
  });

  it("should render both snaps with correct message", () => {
    render(
      <TestWrapper>
        <SnapMessage snapType={SnapType.BOTH} />
      </TestWrapper>
    );

    expect(screen.getByText("SNAP VALUE! SNAP SUIT!")).toBeInTheDocument();
  });
});
