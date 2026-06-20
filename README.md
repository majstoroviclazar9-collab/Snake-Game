# Snake-Game
Features
Classic Snake gameplay on a 20 x 20 grid
Smooth canvas-based graphics and a responsive glassmorphism-style interface
Four labeled speed settings, from Slow to Extreme
Keyboard controls for desktop and swipe controls for mobile
Pause, resume, reset, and play-again controls
Wraparound board edges
Persistent high score saved in the browser with localStorage
Responsive layout for desktop and mobile screens
How to Play
Select your preferred speed.
Click Start Game.
Move the snake toward the red apples.
Each apple adds 10 points and makes the snake longer.
Avoid colliding with the snake's own body. The board edges wrap around to the opposite side.
Controls
Action	Desktop	Mobile
Move	Arrow keys	Swipe on the game board
Pause / Resume	Spacebar or Pause button	Pause button
Restart	Reset button	Reset button

Getting Started
No installation or build process is required.
Clone or download this repository.
Open snake-game/snake.html in a modern web browser.
Click Start Game and play.
You can also run the project through a local development server. For example, with Python installed:
cd snake-game
python -m http.server 8000
Then visit http://localhost:8000/snake.html.
The interface uses Font Awesome from a CDN, so an internet connection is needed for the icons to load. The game itself has no other external dependencies.

Project Structure
Snake/
├── README.md
└── snake-game/
    ├── snake.html   # Page structure and game interface
    ├── style.css    # Layout, visual design, and responsive styles
    └── game.js      # Game loop, controls, scoring, and canvas rendering
Built With
HTML5
CSS3
JavaScript
Canvas API
Font Awesome
Possible Future Improvements
Sound effects and background music
Multiple game modes or difficulty presets
Obstacles and bonus items
A leaderboard
Custom snake themes
