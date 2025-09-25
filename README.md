# Dividnd - Dividend Portfolio Tracker

A comprehensive web application for tracking dividend investments, analyzing portfolio performance, and building wealth through passive income. Built with modern web technologies and designed for both individual investors and professionals.

## Features

### Portfolio Management
- **Multi-Portfolio Support**: Create and manage multiple portfolios (Premium feature)
- **Position Tracking**: Add stock positions with purchase price, shares, and dates
- **Real-time Performance**: Track unrealized gains/losses and portfolio value
- **Dividend Analytics**: Calculate expected annual dividend income and yields

### Analytics & Insights
- **Performance Charts**: Beautiful visualizations using Nivo charts
- **Dividend Calendar**: Track upcoming dividend payments
- **Portfolio Optimization**: Advanced analytics for portfolio improvement
- **Custom Reporting**: Generate detailed reports (Premium feature)

### Investment Tools
- **Future Value Calculator**: Project portfolio growth with compound interest
- **Stock Suggestions**: Discover high dividend yield stocks
- **Export Data**: Download portfolio data as CSV/PDF (Premium feature)
- **Goal Setting**: Set monthly and annual dividend income targets

### Security & Privacy
- **Bank-level Security**: Encrypted data storage and secure authentication
- **OAuth Integration**: Sign in with Google or GitHub
- **Data Privacy**: Your financial information is always protected
- **Secure Payments**: Stripe-powered subscription management

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Nivo Charts** - Beautiful data visualizations

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **Stripe** - Payment processing

### External Services
- **Alpha Vantage API** - Stock market data
- **Finnhub API** - Financial data
- **Resend** - Email service
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Alpha Vantage API key (optional)
- Finnhub API key (optional)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dividnd"
DIRECT_URL="postgresql://username:password@localhost:5432/dividnd"

# Authentication
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email
RESEND_API_KEY="re_..."

# Stock APIs (optional)
ALPHAVANTAGE_KEY="your-alpha-vantage-key"
FINNHUB_KEY="your-finnhub-key"

# Supabase (optional)
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dividnd.git
   cd dividnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code with Prettier
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── _components/       # Shared components
│   ├── api/               # API routes
│   ├── portfolio/         # Portfolio management pages
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── server/               # Server-side code
│   ├── api/              # tRPC routers
│   └── auth/             # Authentication configuration
├── styles/               # Global styles
└── trpc/                 # tRPC client configuration
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and authentication
- **Portfolio** - User portfolios with dividend goals
- **Position** - Stock positions within portfolios
- **StockData** - Cached stock market data
- **DividendData** - Cached dividend information
- **Subscription** - Stripe subscription management
- **NewsletterSubscription** - Email newsletter management

## Pricing Plans

### Free Plan
- 1 Portfolio
- Up to 10 positions
- Basic dividend tracking
- Monthly analytics
- Email support

### Premium Plan ($6.99/month or $69.99/year)
- Unlimited portfolios
- Unlimited positions
- Advanced analytics & charts
- Real-time stock data
- Dividend calendar
- Export data (CSV/PDF)
- Advanced portfolio optimization
- Custom reporting
- Priority support
- White-label options

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out

### Portfolio Management
- `GET /api/trpc/portfolio.getAll` - Get user portfolios
- `POST /api/trpc/portfolio.create` - Create new portfolio
- `PUT /api/trpc/portfolio.update` - Update portfolio
- `DELETE /api/trpc/portfolio.delete` - Delete portfolio

### Position Management
- `GET /api/trpc/position.getAll` - Get portfolio positions
- `POST /api/trpc/position.create` - Add new position
- `PUT /api/trpc/position.update` - Update position
- `DELETE /api/trpc/position.delete` - Remove position

### Stock Data
- `GET /api/trpc/stock.getQuote` - Get stock quote
- `GET /api/trpc/stock.search` - Search stocks

### Subscription Management
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/portal` - Access customer portal
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

### Database Setup

For production, use a managed PostgreSQL service like:
- Supabase
- PlanetScale
- Railway
- Neon

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the `/api-docs` endpoint for API documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Email**: Contact support through the application
- **Discord**: Join our community Discord server

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced portfolio optimization algorithms
- [ ] Social features and portfolio sharing
- [ ] Integration with more brokerages
- [ ] Tax optimization tools
- [ ] Dividend reinvestment planning
- [ ] Advanced charting and technical analysis

## Acknowledgments

- Built with the [T3 Stack](https://create.t3.gg/)
- Stock data provided by Alpha Vantage and Finnhub
- Charts powered by Nivo
- Payments processed by Stripe
- Hosted on Vercel