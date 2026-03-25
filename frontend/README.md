# Clinic Management System - Frontend

A modern web application for managing clinic operations, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication and authorization
- Patient management (add, view, update patients)
- Dashboard with key metrics
- Responsive design with RTL support
- Real-time notifications with React Hot Toast

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to login/dashboard)
├── components/           # Reusable components
│   └── AddPatientModal.tsx
├── services/            # API services
│   └── api.ts
└── utils/               # Utility functions
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000/api)
