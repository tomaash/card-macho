import { Box, Stack, Text } from "@chakra-ui/react";
import type { GameStats as GameStatsType } from "../types/card";

interface GameStatsProps {
  stats: GameStatsType;
  isGameComplete: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({
  stats,
  isGameComplete,
}) => {
  if (!isGameComplete) return null;

  return (
    <Box
      bg="white"
      borderRadius="16px"
      boxShadow="md"
      p={6}
      maxW="400px"
      mx="auto"
      mt={6}
    >
      <Stack gap={4}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.700"
          textAlign="center"
        >
          Game Complete 🎉
        </Text>

        <Stack direction="row" gap={8} justify="center" align="center">
          <Box textAlign="center">
            <Text color="blue.600" fontSize="sm" fontWeight="medium">
              Value Matches
            </Text>
            <Text color="blue.700" fontSize="2xl" fontWeight="bold">
              {stats.valueMatches}
            </Text>
          </Box>

          <Box width="1px" height="60px" bg="gray.200" />

          <Box textAlign="center">
            <Text color="green.600" fontSize="sm" fontWeight="medium">
              Suit Matches
            </Text>
            <Text color="green.700" fontSize="2xl" fontWeight="bold">
              {stats.suitMatches}
            </Text>
          </Box>
        </Stack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Total cards drawn: {stats.totalCards}
        </Text>
      </Stack>
    </Box>
  );
};
