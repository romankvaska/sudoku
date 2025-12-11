# Quick Reference Guide - Sudoku PWA

## 🚀 Essential Commands

### Development
```bash
# Start dev server
npm run dev

# Start at specific port
npm run dev -- -p 4000

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

### Project Navigation
```bash
# From workspace root
cd d:\Sudoku\sudoku-pwa

# View structure
tree /F

# Open in VS Code
code .

# Open in browser
start http://localhost:3000
```

---

## 📂 Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `src/lib/sudoku.ts` | Puzzle generation & solving logic |
| `src/lib/gameStore.ts` | Game state management (Zustand) |
| `src/lib/db.ts` | IndexedDB operations |
| `src/components/GameBoard.tsx` | Main game board component |
| `src/components/Cell.tsx` | Individual cell component |
| `src/app/game/game-content.tsx` | Game page logic |
| `src/app/layout.tsx` | Root layout |
| `public/sw.js` | Service Worker |
| `public/manifest.json` | PWA configuration |

---

## 🎮 Game Features Quick Guide

### Keyboard Controls
| Key | Action |
|-----|--------|
| `1-9` | Enter number in selected cell |
| `Delete`/`Backspace` | Clear selected cell |
| `Arrow Keys` | Navigate cells (coming soon) |
| `Esc` | Deselect cell |

### Mouse/Touch
- **Click/Tap** cell to select
- **Enter number** and press Enter/Tab
- **Pause button** to pause game
- **Hint button** to reveal number

---

## 📊 Data Structures

### GameState (Zustand)
```typescript
{
  id: string;
  board: number[][];           // Current state (0 = empty)
  puzzle: number[][];          // Original clues
  solution: number[][];        // Complete solution
  difficulty: Difficulty;      // 'easy' | 'medium' | 'hard' | 'expert'
  status: GameStatus;          // 'playing' | 'paused' | 'completed'
  startTime: number;           // Unix timestamp
  elapsedTime: number;         // Seconds
  solved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### IndexedDB Tables
```
games:
  - id, difficulty, createdAt, solveTime, solved

tournaments:
  - id, name, difficulty, status, createdAt

participants:
  - id, tournamentId, userId, solved, joinedAt
```

---

## 🔧 Development Workflow

### 1. Create New Feature
```bash
# Create component
# Add to appropriate directory

# Import in parent component
import { YourComponent } from '@/components/YourComponent'

# Use in JSX
<YourComponent />
```

### 2. Add Game Logic
```bash
# Add functions to src/lib/sudoku.ts
# Export from file
# Use in components via hooks

# Example:
import { SudokuSolver } from '@/lib/sudoku'
const puzzle = SudokuSolver.generatePuzzle('easy')
```

### 3. Modify Game State
```bash
# Edit src/lib/gameStore.ts

# Add new action:
newAction: (params) => {
  // Update state using set()
}

# Use in component:
const { currentGame, newAction } = useGameStore()
newAction(param)
```

### 4. Test Changes
```bash
# Start dev server
npm run dev

# Open http://localhost:3000

# Test feature
# Check DevTools for errors
# F12 -> Console, Network, Storage
```

---

## 🐛 Debugging Tips

### Check Game State
```javascript
// In browser console:
// (Game must be running)
window.__ZUSTAND_DEBUG__
```

### View IndexedDB Data
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Storage" > "IndexedDB" > "SudokuGameDB"
4. View tables and data

### Service Worker Status
1. DevTools > Application > Service Workers
2. Check if registered and active
3. View scope and update status

### Network Issues
1. DevTools > Network tab
2. Check for failed requests
3. Verify offline mode toggle
4. Check cache status

---

## 📦 Dependencies

### Core
```json
{
  "next": "^16.0.8",
  "react": "^19.0.0-rc",
  "typescript": "^5"
}
```

### State & Storage
```json
{
  "zustand": "^4.4.0",
  "dexie": "^3.2.4",
  "idb": "^8.0.0"
}
```

### UI
```json
{
  "tailwindcss": "^3.4.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0"
}
```

---

## 🌍 Environment Variables

Currently none required. For future phases:

```env
# .env.local (create if needed)
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://...
```

---

## 📱 PWA Testing

### Test Offline
1. Open DevTools (F12)
2. Network tab > toggle "Offline"
3. App should still work
4. Data saves to IndexedDB

### Test Install
1. Desktop: Click install icon in address bar
2. Mobile: Share > "Add to Home Screen"
3. Launch from home screen
4. Should work standalone

### Test Service Worker
1. DevTools > Application > Service Workers
2. Should show "active and running"
3. Checkbox to test offline
4. Check Cache Storage for assets

---

## 🎯 Common Tasks

### Add New Difficulty Level
1. Update `Difficulty` type in `types/index.ts`
2. Update `getCluesCount()` in `sudoku.ts`
3. Add UI button in `page.tsx`
4. Test puzzle generation

### Add Game Statistics
1. Create calculation function in `db.ts`
2. Call from history page
3. Add UI component
4. Display results

### Add New Tournament Feature
1. Update `Tournament` type
2. Modify `tournaments/page.tsx`
3. Update tournament table schema
4. Test CRUD operations

### Optimize Performance
1. Check DevTools Performance tab
2. Identify bottlenecks
3. Profile rendering time
4. Optimize with React DevTools

---

## 🚢 Deployment Checklist

- [ ] Run `npm run build` - check for errors
- [ ] Test `npm run start` - verify production build
- [ ] Check bundle size (`npm run build` output)
- [ ] Test offline functionality
- [ ] Test on mobile device
- [ ] Verify Service Worker installed
- [ ] Check PWA installable (lighthouse)
- [ ] Update version in `package.json`
- [ ] Push to git
- [ ] Deploy to Vercel/hosting

---

## 📚 Learning Resources

### Sudoku Algorithm
- Backtracking: https://en.wikipedia.org/wiki/Backtracking
- Algorithm visualization: https://visualgo.net

### Next.js
- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Zustand
- GitHub: https://github.com/pmndrs/zustand
- Examples: https://github.com/pmndrs/zustand/tree/main/examples

### IndexedDB
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- Dexie: https://dexie.org/

### PWA
- Web.dev: https://web.dev/progressive-web-apps/
- Manifest: https://web.dev/add-manifest/

---

## 🎓 Next Steps for Learning

1. **Review the code structure** - Understand folder organization
2. **Study sudoku.ts** - Learn the puzzle algorithm
3. **Explore gameStore.ts** - Understand state management
4. **Read component code** - See how UI is built
5. **Test offline mode** - Understand PWA capabilities
6. **Try modifications** - Add small features to practice

---

## 💡 Tips & Tricks

### Development
- Use `console.log()` liberally during development
- DevTools is your best friend (F12)
- Check browser support for features
- Test responsive design at various sizes

### Performance
- Use React DevTools Profiler
- Check Network tab for slow requests
- Monitor bundle size
- Use lazy loading for routes

### Code Quality
- Run `npm run lint` before commits
- Use TypeScript for type safety
- Keep components small and focused
- Document complex logic

### Git
```bash
git init
git add .
git commit -m "Initial Sudoku PWA"
git remote add origin <repo-url>
git push
```

---

## 🆘 Help Commands

```bash
# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Update packages
npm update

# Check for vulnerabilities
npm audit

# Check Node version
node --version

# Check TypeScript version
npx tsc --version

# Check Next.js version
npx next --version
```

---

## 🎯 Feature Implementation Quick Template

```typescript
// 1. Add type if needed (src/types/index.ts)
export interface NewFeature {
  id: string;
  // ... properties
}

// 2. Add to store (src/lib/gameStore.ts)
newFeature: (params) => {
  set({ ... })
}

// 3. Create component (src/components/NewFeature.tsx)
export default function NewFeature() {
  const { state } = useGameStore()
  return <div>...</div>
}

// 4. Use in page (src/app/page.tsx)
import NewFeature from '@/components/NewFeature'

export default function Page() {
  return <NewFeature />
}
```

---

**Last Updated**: December 11, 2025
**Version**: 1.0.0
**Status**: Production Ready
