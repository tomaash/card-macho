import { useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Container,
  Heading,
  Spinner,
  Center,
  Stack,
} from "@chakra-ui/react";
import { useCardGame } from "./hooks/useCardGame";
import { Card } from "./components/Card";
import { GameStats } from "./components/GameStats";
import { SnapMessage } from "./components/SnapMessage";

function App() {
  const {
    gameState,
    deck,
    initializeGame,
    drawNextCard,
    resetGame,
    isLoading,
    error,
    canDrawCard,
  } = useCardGame();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Box
          bg="red.50"
          border="1px"
          borderColor="red.200"
          borderRadius="12px"
          p={4}
        >
          <Text color="red.600" fontWeight="medium">
            Error: {error}
          </Text>
        </Box>
        <Center mt={4}>
          <Button onClick={resetGame} colorScheme="blue" size="lg">
            Try Again
          </Button>
        </Center>
      </Container>
    );
  }

  if (!deck && isLoading) {
    return (
      <Container
        maxW="container.md"
        py={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="blue.500" />
        <Text>Initializing deck...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="600px" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <Stack gap={{ base: 6, md: 8 }}>
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="gray.700" mb={2}>
            Card Macho™
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Draw cards and watch for matches!
          </Text>
        </Box>

        {/* Game Status */}
        {deck && (
          <Box
            bg="gray.50"
            px={4}
            py={2}
            borderRadius="8px"
            textAlign="center"
            width="100%"
          >
            <Text fontSize="sm" color="gray.600">
              Cards remaining: <strong>{deck.remaining}</strong>
            </Text>
          </Box>
        )}

        {/* Cards Display */}
        {!gameState.isGameComplete && (
          <>
            <Stack
              direction="row"
              gap={6}
              justify="center"
              align="center"
              width="100%"
            >
              <Stack gap={2} flex={1} align="center">
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                  Previous Card
                </Text>
                <Card
                  card={gameState.previousCard || undefined}
                  isPlaceholder={!gameState.previousCard}
                  label="Previous"
                />
              </Stack>

              <Stack gap={2} flex={1} align="center">
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                  Current Card
                </Text>
                <Card
                  card={gameState.currentCard || undefined}
                  isPlaceholder={!gameState.currentCard}
                  label="Current"
                />
              </Stack>
            </Stack>

            {/* Snap Message - Reserved Space */}
            <Box
              minHeight="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <SnapMessage snapType={gameState.snapType} />
            </Box>
          </>
        )}

        {/* Draw Button */}
        {canDrawCard && !gameState.isGameComplete && (
          <Button
            onClick={drawNextCard}
            loading={isLoading}
            colorScheme="blue"
            size="lg"
            borderRadius="12px"
            boxShadow="md"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "lg",
            }}
            px={8}
            py={6}
            fontSize="lg"
            disabled={isLoading}
            width="100%"
          >
            {isLoading ? "Drawing..." : "Draw Card"}
          </Button>
        )}

        {/* Game Stats */}
        <GameStats
          stats={gameState.stats}
          isGameComplete={gameState.isGameComplete}
        />

        {/* Reset Button */}
        {gameState.isGameComplete && (
          <Button
            onClick={resetGame}
            variant="outline"
            colorScheme="blue"
            size="md"
            borderRadius="12px"
            mt={4}
            color="blue.600"
            borderColor="blue.300"
            width="100%"
            _hover={{
              bg: "blue.50",
              borderColor: "blue.400",
            }}
          >
            Play Again
          </Button>
        )}
      </Stack>
    </Container>
  );
}

export default App;
