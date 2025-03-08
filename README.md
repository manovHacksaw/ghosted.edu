# Ghosted.edu

A modern educational platform that helps students track and manage their job applications while providing AI-powered insights and support.

## 🌟 Features

- **Smart Dashboard**: Track and manage your job applications in one place
- **AI Integration**: Powered by Google's Generative AI for intelligent insights
- **OpenCampus Authentication**: Secure login system using OpenCampus ID Connect
- **Interactive UI**: Beautiful, responsive interface with modern animations
- **Pricing Plans**: Flexible subscription options for different user needs

## 🚀 Tech Stack

- **Frontend**: Next.js 15.1.7 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI for accessible components
- **Database**: Prisma ORM
- **Authentication**: OpenCampus ID Connect
- **AI**: Google Generative AI

## 📦 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A database supported by Prisma (e.g., PostgreSQL)
- OpenCampus ID Connect credentials
- Google Generative AI API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ghosted.edu.git
cd ghosted.edu
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
token
DATABASE_URL
GEMINI_API_KEY
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
├── app/                  # Next.js app router pages
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard views
│   ├── jobs/           # Job management
│   ├── onboarding/     # User onboarding
│   └── pricing/        # Pricing plans
├── components/          # Reusable UI components
├── context/            # React context providers
├── lib/                # Utility functions
└── prisma/             # Database schema and migrations
```

## 🔧 Development

- **Running Tests**:
```bash
npm run test
# or
yarn test
```

- **Linting**:
```bash
npm run lint
# or
yarn lint
```

- **Building for Production**:
```bash
npm run build
# or
yarn build
```

## 🚀 Deployment

The application is optimized for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



For support, email [debanjanmondalk2005@gmail.com] or open an issue in the GitHub repository.
