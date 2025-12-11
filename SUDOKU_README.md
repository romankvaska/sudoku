# Sudoku PWA - Progressive Web Application

A modern, fully-featured Sudoku game built with Next.js that works both online and offline with game history tracking, tournaments, and leaderboards.

## Features

### 🎮 Core Gameplay
- **4 Difficulty Levels**: Easy, Medium, Hard, and Expert puzzles
- **Real-time Validation**: Get instant feedback on number placement
- **Hint System**: Get one hint per game to help you solve puzzles
- **Pause & Resume**: Save your progress and continue later
- **Timer**: Track how long it takes to solve each puzzle

### 📱 Progressive Web App (PWA)
- **Offline Support**: Play completely offline with IndexedDB storage
- **Installable**: Install on home screen for native app feel
- **Service Worker**: Automatic caching and offline-first strategy
- **Dark Mode**: Built-in dark theme support

### 📊 Game History & Statistics
- **Game Records**: All completed games saved locally
- **Statistics**: View total games, average time, fastest solve
- **Filter by Difficulty**: Organize games by difficulty level
- **Delete History**: Remove unwanted game records

### 🏆 Tournaments
- **Create & Join**: Organize or participate in tournaments
- **Leaderboards**: See rankings of tournament participants
- **Multiple Tournaments**: Create different tournaments for different groups
- **Status Tracking**: Upcoming, Active, and Completed tournaments

### 🎯 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Support**: Full keyboard navigation
- **Cell Highlighting**: Auto-highlight related cells (row, column, box)
- **Intuitive UI**: Clean, modern interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: IndexedDB (offline), PostgreSQL (future)
- **Offline Storage**: Dexie.js, Service Worker
- **Deployment**: Vercel (recommended)

## Project Structure

```
sudoku-pwa/
├── src/
│   ├── app/
│   │   ├── game/              # Game page with puzzle play
│   │   ├── game-content.tsx   # Game logic and UI
│   │   ├── history/           # Game history page
│   │   ├── tournaments/       # Tournament management
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── GameBoard.tsx      # 9x9 Sudoku grid
│   │   └── Cell.tsx           # Individual cell component
│   ├── lib/
│   │   ├── sudoku.ts          # Sudoku solver & generator
│   │   ├── gameStore.ts       # Zustand game state
│   │   ├── db.ts              # IndexedDB utilities
│   │   └── useServiceWorker.ts # SW registration
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # PWA icons
├── package.json
└── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Quick Start

1. **Navigate to project**:
   ```bash
   cd d:\Sudoku\sudoku-pwa
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## How to Play

### Single Player Game
1. Go to **Play** on the home page
2. Select a difficulty level (Easy, Medium, Hard, Expert)
3. Fill in the empty cells with numbers 1-9
4. Each row, column, and 3x3 box must contain numbers 1-9 without repeats
5. Click **Get Hint** to reveal one number
6. Game saves automatically and displays solving time when complete

### Features While Playing
- **Pause/Resume**: Pause the game and continue later
- **New Game**: Start a new puzzle of the same difficulty
- **Abandon**: Give up on the current puzzle
- **Dark Mode**: Toggle between light and dark themes

### Game History
- Click **History** to see all completed games
- View statistics: total games, average time, fastest/slowest solves
- Filter by difficulty level
- Delete individual game records

### Tournaments
- Click **Tournaments** to view available tournaments
- Join tournaments to compete with others
- See live leaderboards of tournament participants
- Create your own tournaments (coming soon)

## Sudoku Algorithm

### Puzzle Generation
- Uses backtracking algorithm to generate valid puzzles
- Ensures unique solution for each puzzle
- Difficulty based on number of clues:
  - **Easy**: 40-50 clues
  - **Medium**: 30-40 clues
  - **Hard**: 20-30 clues
  - **Expert**: 15-20 clues

### Solving & Validation
- Real-time validation of moves
- Detects conflicts in rows, columns, and 3x3 boxes
- Automatic puzzle solving for hints

## Offline Functionality

### Local Storage with IndexedDB
- Game progress saved automatically
- Game history persistent across sessions
- Works completely offline after first load
- Data syncs when connection restored (future)

### Service Worker
- Caches essential assets for offline access
- Network-first strategy for fresh content
- Graceful fallback to cached assets
- Background sync support (future)

## Development Roadmap

### Phase 1: Core (Complete ✅)
- [x] Sudoku board and game logic
- [x] Difficulty selection
- [x] Timer and game controls
- [x] Real-time validation

### Phase 2: Features (Complete ✅)
- [x] Pause/Resume functionality
- [x] Hint system
- [x] Game completion modal
- [x] Keyboard support

### Phase 3: Offline (Complete ✅)
- [x] IndexedDB integration
- [x] Service Worker setup
- [x] PWA manifest
- [x] Offline-first strategy

### Phase 4: History & Database (Complete ✅)
- [x] Game history UI
- [x] Statistics calculation
- [x] Filter and delete games

### Phase 5: Tournaments (Complete ✅)
- [x] Tournament creation UI
- [x] Join tournaments
- [x] Leaderboards

### Phase 6: Future Enhancements
- [ ] Backend API (Node.js/Express)
- [ ] PostgreSQL database for cloud sync
- [ ] User authentication
- [ ] Global leaderboards
- [ ] Multiplayer/real-time tournaments
- [ ] Achievement system
- [ ] Push notifications
- [ ] Advanced analytics

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## PWA Installation

### Desktop
1. Click the install icon in the browser address bar
2. Or go to Settings > Apps & Features > Install app

### Mobile
1. Open the app in mobile browser
2. Tap the share button
3. Select "Add to Home Screen"
4. Tap the app to launch

## Performance

- Built with Turbopack for fast compilation
- Optimized for Core Web Vitals
- Lazy loading of routes
- Efficient state management with Zustand
- Minimal bundle size

## Troubleshooting

### Service Worker Issues
- Clear browser cache: Settings > Privacy > Clear browsing data
- Unregister old workers: DevTools > Application > Service Workers
- Force update: Close and reopen the app

### Storage Issues
- IndexedDB max ~50MB per origin
- Check DevTools > Application > Storage
- Clear data if experiencing quota errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

### Deploy to Other Platforms

The app can be deployed to:
- Netlify
- AWS Amplify
- GitHub Pages (static export)
- Self-hosted servers

## Feedback & Support

For questions, issues, or suggestions, please create an issue in the repository.

---

**Happy Sudoku solving! 🎮**
