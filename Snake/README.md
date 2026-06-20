# Snake Game

A modern browser-based version of the classic Snake game, built with HTML, CSS, and vanilla JavaScript. Guide the snake around the board, collect apples, and try to beat your high score without running into yourself.

## Features

- Classic Snake gameplay on a 20 x 20 grid
- Smooth canvas-based graphics and a responsive glassmorphism-style interface
- Four labeled speed settings, from **Slow** to **Extreme**
- Keyboard controls for desktop and swipe controls for mobile
- Pause, resume, reset, and play-again controls
- Wraparound board edges
- Persistent high score saved in the browser with `localStorage`
- Responsive layout for desktop and mobile screens

## How to Play

1. Select your preferred speed.
2. Click **Start Game**.
3. Move the snake toward the red apples.
4. Each apple adds **10 points** and makes the snake longer.
5. Avoid colliding with the snake's own body. The board edges wrap around to the opposite side.

### Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | Arrow keys | Swipe on the game board |
| Pause / Resume | Spacebar or Pause button | Pause button |
| Restart | Reset button | Reset button |

## Getting Started

No installation or build process is required.

1. Clone or download this repository.
2. Open `snake-game/snake.html` in a modern web browser.
3. Click **Start Game** and play.

You can also run the project through a local development server. For example, with Python installed:

```bash
cd snake-game
python -m http.server 8000
```

Then visit [http://localhost:8000/snake.html](http://localhost:8000/snake.html).

> The interface uses Font Awesome from a CDN, so an internet connection is needed for the icons to load. The game itself has no other external dependencies.

## Project Structure

```text
Snake/
├── README.md
└── snake-game/
    ├── snake.html   # Page structure and game interface
    ├── style.css    # Layout, visual design, and responsive styles
    └── game.js      # Game loop, controls, scoring, and canvas rendering
```

## Built With

- HTML5
- CSS3
- JavaScript
- Canvas API
- Font Awesome

## Possible Future Improvements

- Sound effects and background music
- Multiple game modes or difficulty presets
- Obstacles and bonus items
- A leaderboard
- Custom snake themes
