import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SnapType } from "../types/card";

interface SnapMessageProps {
  snapType: SnapType;
}

const getMessageText = (message: SnapType) => {
  switch (message) {
    case SnapType.VALUE:
      return "SNAP VALUE!";
    case SnapType.SUIT:
      return "SNAP SUIT!";
    default:
      return "";
  }
};

const getMessageBg = (message: SnapType) => {
  switch (message) {
    case SnapType.VALUE:
      return "blue.500";
    case SnapType.SUIT:
      return "green.500";
    default:
      return "gray.500";
  }
};

export const SnapMessage: React.FC<SnapMessageProps> = ({ snapType }) => {
  const [displayedMessage, setDisplayedMessage] = useState(
    getMessageText(snapType)
  );

  useEffect(() => {
    if (snapType !== SnapType.NONE) {
      setDisplayedMessage(getMessageText(snapType));
    }
  }, [snapType]);

  const handleAnimationEnd = () => {
    if (snapType === SnapType.NONE) {
      setDisplayedMessage("");
    }
  };

  if (!displayedMessage) return null;

  return (
    <Box
      onAnimationEnd={handleAnimationEnd}
      opacity={snapType !== SnapType.NONE ? 1 : 0}
      data-state={snapType !== SnapType.NONE ? "open" : "closed"}
      bg={getMessageBg(snapType)}
      color="white"
      px={6}
      py={3}
      borderRadius="12px"
      boxShadow="md"
      _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "300ms",
      }}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "300ms",
      }}
      textAlign="center"
      maxW="300px"
      mx="auto"
    >
      <Text fontSize="lg" fontWeight="bold" letterSpacing="wide">
        {displayedMessage}
      </Text>
    </Box>
  );
};
