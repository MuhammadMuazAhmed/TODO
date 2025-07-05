# TodoFlow - AI-Powered Todo & Goal Management App

A modern, interactive todo and goal management application built with React, Vite, and Tailwind CSS, featuring AI-powered productivity insights using Google Gemini AI.

## ✨ Features

- **📝 Smart Todo Management**: Daily, weekly, and monthly todo views
- **🎯 Goal Tracking**: Short-term and long-term goal management
- **🤖 AI Integration**: Google Gemini AI for task analysis, suggestions, and motivation
- **🎨 Duolingo-Style UI**: Engaging animations, mascot, and interactive elements
- **📊 Progress Tracking**: AI-generated progress questions and insights
- **🔐 User Management**: Secure login with localStorage persistence
- **📱 Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables for Production

Create a `.env.production` file with:

```env
VITE_GEMINI_API_KEY=your_production_api_key_here
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
```

#### Static Hosting
```bash
# Build the project
npm run build

# Upload the dist folder to your hosting provider
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check for linting errors
- `npm run clean` - Clean build directory

### Project Structure

```
src/
├── components/          # React components
│   ├── AIAssistant.jsx  # AI chat interface
│   ├── AINotification.jsx # AI notifications
│   ├── GoalSection.jsx  # Goal management
│   ├── Login.jsx        # User authentication
│   ├── Mascot.jsx       # Interactive mascot
│   ├── ProgressQuestions.jsx # Progress tracking
│   ├── Sidebar.jsx      # Navigation sidebar
│   └── TodoSection.jsx  # Todo management
├── services/
│   └── geminiAI.js      # AI service integration
├── App.jsx              # Main application
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite with production optimizations:

- **Code Splitting**: Automatic chunk splitting for better caching
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser for optimal bundle size
- **CSS Optimization**: Automatic CSS code splitting

### Tailwind CSS

Custom animations and utilities are defined in `src/index.css`:

- Floating animations
- Interactive hover effects
- Custom scrollbar styling
- Gradient and shimmer effects

## 🤖 AI Features

### Google Gemini AI Integration

The app uses Google Gemini AI for:

- **Task Analysis**: Personalized insights for new tasks
- **Completion Celebrations**: Motivational messages for completed tasks
- **Progress Questions**: AI-generated reflection questions
- **Productivity Insights**: Personalized tips and recommendations
- **Goal Recommendations**: AI-suggested goals based on user activity

### AI Service Configuration

The AI service automatically falls back to mock responses when:
- API key is not configured
- Network issues occur
- Rate limits are exceeded

## 🔒 Security

### Production Security Features

- **Input Sanitization**: All user inputs are sanitized
- **XSS Prevention**: AI responses are cleaned and sanitized
- **Environment Variables**: Sensitive data stored in environment variables
- **No Console Logs**: Production builds exclude debug information
- **URL Sanitization**: Automatic cleanup of sensitive URL parameters

### Data Storage

- **Local Storage**: User data stored locally in browser
- **No Server**: Client-side only application
- **Privacy First**: No data sent to external servers except AI API

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Customization

### Themes and Styling

The app uses Tailwind CSS with custom animations. Key customization points:

- **Colors**: Modify Tailwind config in `tailwind.config.js`
- **Animations**: Custom keyframes in `src/index.css`
- **Mascot**: Customizable mascot emotions and animations
- **Notifications**: Duolingo-style notification system

### Adding New Features

1. Create new components in `src/components/`
2. Add routes in `App.jsx`
3. Update sidebar navigation in `Sidebar.jsx`
4. Add any new AI features in `src/services/geminiAI.js`

## 🐛 Troubleshooting

### Common Issues

**AI not working:**
- Check your Gemini API key in environment variables
- Verify API key has proper permissions
- Check browser console for errors

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

**Performance issues:**
- Run `npm run build:analyze` to check bundle size
- Optimize large dependencies
- Check for memory leaks in development

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Google Gemini AI**
