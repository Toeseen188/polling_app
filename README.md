# PollApp - Next.js Polling Application

A modern, full-featured polling application built with Next.js 15, TypeScript, and Tailwind CSS. Create polls, gather community feedback, and view real-time results with a beautiful, responsive interface.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Poll Creation**: Intuitive interface for creating polls with multiple options
- **Poll Management**: Dashboard to view and manage your created polls
- **Real-time Voting**: Vote on polls and see results update instantly
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS

## 🏗️ Project Structure

```
polling_app/alx-polly/
├── app/                          # Next.js 15 app directory
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   └── layout.tsx           # Auth layout
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── dashboard/           # Main dashboard page
│   │   └── layout.tsx           # Dashboard layout with sidebar
│   ├── polls/                   # Poll-related pages
│   │   ├── create/              # Create new poll page
│   │   ├── [id]/                # Individual poll view (dynamic route)
│   │   └── page.tsx             # All polls listing page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx           # Button component
│   │   ├── input.tsx            # Input component
│   │   └── card.tsx             # Card components
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx       # Login form
│   │   └── register-form.tsx    # Registration form
│   ├── polls/                   # Poll-related components
│   │   ├── poll-card.tsx        # Poll display card
│   │   └── create-poll-form.tsx # Poll creation form
│   └── dashboard/               # Dashboard components
│       └── navigation.tsx       # Dashboard navigation sidebar
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utility functions
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Core type interfaces
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js built-in routing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd polling_app/alx-polly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features Implementation

### Authentication System
- Login and registration forms with validation
- Secure password handling (to be implemented)
- JWT token management (to be implemented)

### Poll Management
- Create polls with multiple options
- Set expiration dates and voting rules
- Real-time vote counting and visualization
- Poll sharing and discovery

### Dashboard
- Overview of user's polls and activity
- Quick actions for common tasks
- Statistics and analytics display

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database (to be implemented)
DATABASE_URL="your-database-url"

# Authentication (to be implemented)
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (if needed)
# API_KEY="your-api-key"
```

### Tailwind CSS
The project uses Tailwind CSS v4 with the new CSS engine. Configuration is handled automatically.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚧 Upcoming Features

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User profile management
- [ ] Poll sharing and social features
- [ ] Advanced analytics and charts
- [ ] Email notifications
- [ ] API endpoints for mobile apps
- [ ] Real-time updates with WebSockets
- [ ] Poll templates and categories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives

---

**Happy Polling! 🗳️**
