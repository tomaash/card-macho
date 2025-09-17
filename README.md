# Card Macho™ - Card Matching Game

A React-based card game where players draw cards from a shuffled deck and watch for matches between consecutive cards. The game tracks value matches (same rank) and suit matches, providing an engaging way to test your luck and pattern recognition skills.

## 🎮 What is Card Macho?

Card Macho is an interactive card game that:

- Uses a real deck of cards via the [Deck of Cards API](https://deckofcardsapi.com/)
- Allows players to draw cards one by one from a shuffled deck
- Detects and celebrates "SNAP" moments when consecutive cards match by value, suit, or both
- Tracks game statistics including total matches and cards drawn
- Provides a clean, responsive UI built with Chakra UI

### Game Rules

1. Start with a shuffled deck of 52 cards
2. Draw cards one at a time
3. Watch for matches between the current and previous card:
   - **Value Match**: Same rank (e.g., two Kings)
   - **Suit Match**: Same suit (e.g., both Hearts)
   - **Perfect Match**: Both value and suit match
4. Game ends when all cards are drawn
5. View your final statistics and play again!

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Card.tsx         # Individual card display component
│   ├── GameStats.tsx    # Game statistics display
│   ├── SnapMessage.tsx  # Match notification component
│   └── __tests__/       # Component tests
├── hooks/               # Custom React hooks
│   ├── useCardGame.ts   # Main game logic hook
│   ├── useDeckAPI.ts    # API integration hook
│   └── __tests__/       # Hook tests
├── types/               # TypeScript type definitions
│   └── card.ts          # Card, Deck, and Game state types
├── __tests__/           # App-level tests
├── test/                # Test configuration
└── App.tsx              # Main application component
```

### Key Architecture Components

- **`useCardGame`**: Core game state management and logic
- **`useDeckAPI`**: Handles all API interactions with Deck of Cards API
- **Component Architecture**: Modular, testable components with clear responsibilities
- **Type Safety**: Comprehensive TypeScript types for all game entities
- **Testing**: Full test coverage with Vitest and React Testing Library

## 🚀 How to Run the Project

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation & Setup

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd drivvn-card-deck
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to play the game!

### Available Scripts

- **`pnpm dev`** - Start development server with hot reload
- **`pnpm build`** - Build for production
- **`pnpm preview`** - Preview production build locally
- **`pnpm lint`** - Run ESLint for code quality checks

## 🧪 How to Run Tests

The project includes comprehensive tests for all components and hooks using Vitest and React Testing Library.

### Running Tests

```bash
# Run all tests once
pnpm test:run
# or
npm run test:run

# Run tests in watch mode (recommended for development)
pnpm test
# or
npm run test

# Run tests with UI interface
pnpm test:ui
# or
npm run test:ui
```

### Test Coverage

The test suite includes:

- **Component Tests**: UI behavior, user interactions, and rendering
- **Hook Tests**: Game logic, state management, and API integration
- **Integration Tests**: Full app functionality and user workflows

### Test Structure

```
src/
├── components/__tests__/
│   ├── Card.test.tsx
│   ├── GameStats.test.tsx
│   └── SnapMessage.test.tsx
├── hooks/__tests__/
│   ├── useCardGame.test.ts
│   └── useDeckAPI.test.ts
└── __tests__/
    └── App.test.tsx
```

## 🛠️ Technology Stack

### Core Technologies

- **React 19** - UI framework with latest features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **Chakra UI** - Modern, accessible component library

### Development Tools

- **ESLint** - Code linting and quality enforcement
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **JSDOM** - DOM environment for testing

### External APIs

- **[Deck of Cards API](https://deckofcardsapi.com/)** - Provides real card deck functionality

## 🎯 Features

- ✅ **Real Card Deck**: Uses actual playing cards via external API
- ✅ **Match Detection**: Automatically detects value and suit matches
- ✅ **Visual Feedback**: Animated snap messages for matches
- ✅ **Game Statistics**: Tracks matches and progress
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Error Handling**: Graceful handling of API failures
- ✅ **Loading States**: Smooth user experience during API calls
- ✅ **Accessibility**: Built with accessible components
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Test Coverage**: Comprehensive test suite

## 🔧 Development

### Code Quality

- ESLint configuration with React and TypeScript rules
- Consistent code formatting and style guidelines
- Type-safe development with comprehensive TypeScript types

### Testing Philosophy

- Unit tests for individual components and hooks
- Integration tests for user workflows
- Mocked API calls for reliable testing
- High test coverage for critical game logic

---

**Enjoy playing Card Macho!**
