# IPL Points Table Progression

A dynamic visualization tool that tracks and displays the progression of the Indian Premier League (IPL) points table throughout all seasons.

![IPL Points Table Progression](https://i.postimg.cc/4xwT84kT/screenshot-2025-04-16-at-7-09-33-pm.png)

## Overview

This interactive Next.js application provides cricket enthusiasts with a comprehensive view of how team standings evolved during each IPL season. Watch the points table transform match-by-match, visualize team rank progressions, and explore the tournament's narrative through an intuitive interface.

## Features

- **Real-time Points Table Updates**: Observe how the standings change with each completed match
- **Complete Match Timeline**: View all match results in chronological order
- **Interactive Playback Controls**:
  - Auto-play the entire season progression
  - Step forward or backward through individual matches
  - Pause at any point to analyze the standings
  - Jump to specific matches by selecting them from the timeline
- **Team Rank Visualization**: Track any team's position throughout the season with graphical representations
- **Multi-Season Support**: Explore data from all IPL seasons

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ipl-points-table-progression.git
   cd ipl-points-table-progression
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Select a Season**: Choose which IPL season you want to explore
2. **Playback Controls**: Use the control panel to navigate through the season:
   - Play: Automatically progress through matches
   - Pause: Stop at the current match
   - Forward/Back: Move one match at a time
   - Timeline: Click on specific match cards to jump to that point in the season
3. **Team Analysis**: Select a team to view their rank progression graph

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Data visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- Data sourced from [official IPL statistics](https://www.iplt20.com/)
- Special thanks to the cricket statistics community
