# FreightPro - Sales Management Dashboard

A modern, professional freight sales management dashboard built with Next.js 14+, featuring sophisticated animations, intuitive UI/UX, and comprehensive functionality for managing freight operations.

## Features

- **Dashboard Overview**: Real-time metrics, revenue trends, and activity feed
- **Profile Management**: User profile with settings and activity tracking
- **Accepted Loads**: Comprehensive load management with filtering and search
- **Shipper Management**: Track shipper relationships and manage trucker bids
- **Vehicle Fleet**: Monitor truck availability and assignments
- **In-Transit Tracking**: Real-time shipment tracking and status updates
- **Reports & Analytics**: Business insights and performance metrics

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Shadcn/ui patterns
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Project Structure

```
freight_sales_dashboard/
├── app/
│   ├── (dashboard)/          # Dashboard pages
│   │   ├── dashboard/        # Main overview
│   │   ├── profile/          # User profile
│   │   ├── loads/            # Accepted loads
│   │   ├── shippers/         # Shipper management with trucker bids
│   │   ├── vehicles/         # Vehicle fleet
│   │   ├── in-transit/       # Live tracking
│   │   ├── reports/          # Analytics
│   │   └── settings/         # Settings
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home redirect
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── layout/               # Layout components (Sidebar, Header)
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── mock-data.ts          # Mock data for loads, vehicles, shippers
│   ├── mock-trucker-bids.ts  # Mock trucker bid data
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: Gray (#F9FAFB)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tracking-tight
- **Body**: Normal weight, readable line-height

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Dashboard
- Key performance metrics with trend indicators
- Revenue chart (6-month view)
- Top performing routes
- Recent load activities

### Shipper Management
- View and manage shipper relationships
- Track active loads per shipper
- Integrated trucker bid management
- View all bids for shipper's loads
- Accept, reject, or counter-offer bids directly
- Detailed bid information with trucker ratings

### Load Management
- Comprehensive load tracking
- Status-based filtering
- Search across all fields
- Detailed load information

### Vehicle Fleet
- Real-time vehicle status
- Driver assignments
- Maintenance tracking
- Capacity management

## Contributing

This is a private project. For questions or suggestions, please contact the development team.

## License

Proprietary - All rights reserved
