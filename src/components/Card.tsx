import { Box, Image, Text } from "@chakra-ui/react";
import type { Card as CardType } from "../types/card";

interface CardProps {
  card?: CardType;
  isPlaceholder?: boolean;
  label?: string;
}

export const Card: React.FC<CardProps> = ({
  card,
  isPlaceholder = false,
  label,
}) => {
  if (isPlaceholder) {
    return (
      <Box
        width="100%"
        height="100%"
        borderRadius="12px"
        border="2px dashed"
        borderColor="gray.300"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        boxShadow="sm"
        // transition="all 0.2s"
        // actual size of our cards is 226x314
        aspectRatio="226/314"
      >
        <Text color="gray.400" fontSize="sm" textAlign="center">
          {label || "No Card"}
        </Text>
      </Box>
    );
  }

  if (!card) return null;

  return (
    <Image
      src={card.image}
      alt={`${card.value} of ${card.suit}`}
      width="100%"
      height="100%"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
      }}
    />
  );
};
