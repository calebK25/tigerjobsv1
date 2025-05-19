# TigerJobs - Job Search Platform

A modern job search platform built with React, TypeScript, and Supabase, featuring a beautiful UI powered by shadcn-ui and Tailwind CSS.

## Features

- Modern, responsive user interface
- Real-time job search and filtering
- User authentication and profile management
- Job application tracking
- Interactive job listings
- Advanced search capabilities
- Mobile-friendly design

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn-ui components
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Supabase for authentication and database
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Animations**: GSAP for smooth animations

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tigerjobs
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── data/          # Static data and constants
├── hooks/         # Custom React hooks
├── integrations/  # Third-party service integrations
├── lib/           # Utility functions and configurations
├── pages/         # Page components
├── services/      # API and service functions
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
