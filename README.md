# 🚀 ShortAF - URL Shortener

> **"Because patience is overrated."**

A modern, blazing-fast URL shortener with a stunning UI that transforms your long, unwieldy URLs into beautiful, memorable short links. Built with cutting-edge React technology and powered by Material-UI v7.

![ShortAF Hero](https://img.shields.io/badge/ShortAF-Rocket%20Powered-blueviolet?style=for-the-badge&logo=rocket)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-7.1.2-0081cb?style=for-the-badge&logo=mui)


Live Link: https://shortaf.vercel.app/

## ✨ Features

### 🎯 Core Functionality
- **Unlimited URL Shortening**: Shorten multiple URLs simultaneously with our intuitive multi-row interface
- **Custom Shortcodes**: Create memorable, branded short codes for your URLs
- **Flexible Validity Periods**: Set custom expiration times (default: 30 minutes) for each short URL
- **Smart Collision Detection**: Automatic uniqueness validation for all generated short codes
- **Instant Redirection**: Lightning-fast redirects to original URLs with automatic expiry checking

### 📊 Advanced Analytics
- **Comprehensive Statistics Dashboard**: Real-time analytics with beautiful data visualizations
- **Click Tracking**: Detailed click analytics including timestamps, sources, and locations
- **Performance Metrics**: Average clicks per URL, active vs expired URLs, and total engagement
- **Interactive Charts**: Visual representations of your URL performance

### 🎨 Premium User Experience
- **Modern Glass-morphism Design**: Stunning UI with gradient backgrounds and blur effects
- **Responsive Layout**: Perfect experience across all devices and screen sizes
- **Smooth Animations**: Delightful micro-interactions and transitions using Framer Motion concepts
- **Dark/Light Theme Support**: Adaptive design that looks great in any lighting
- **Copy-to-Clipboard**: One-click URL copying with success animations
- **Accessibility First**: Full keyboard navigation and screen reader support

### 🛠 Technical Excellence
- **Zero Backend Dependencies**: Fully client-side with localStorage persistence
- **Type-Safe Development**: Complete TypeScript implementation for robust code
- **Advanced Error Handling**: Graceful error management with user-friendly messages
- **Comprehensive Logging**: Built-in logging middleware for debugging and analytics
- **PWA Ready**: Progressive Web App capabilities for offline functionality

## 🏗 Tech Stack

### Frontend Framework
- **React 19.1.0** - Latest React with concurrent features and improved performance
- **TypeScript 4.9.5** - Full type safety and enhanced developer experience
- **React Router DOM 7.6.2** - Modern client-side routing with data loading

### UI/UX Library
- **Material-UI 7.1.2** - Latest Material Design components with custom theming
- **Emotion** - CSS-in-JS styling with runtime performance optimization
- **Material Icons** - Comprehensive icon library with 2000+ icons

### Development Tools
- **React Scripts 5.0.1** - Zero-configuration build tooling
- **Web Vitals** - Performance monitoring and optimization
- **Testing Library** - Comprehensive testing utilities for React applications

### Storage & State Management
- **LocalStorage API** - Persistent client-side data storage
- **React Hooks** - Modern state management with useState and useEffect

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodingManiac11/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see ShortAF in action!

### Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be created in the `build` directory.

## 📁 Project Structure

```
url-shortener/
├── public/                     # Static assets
│   ├── index.html             # Main HTML template
│   ├── manifest.json          # PWA configuration
│   └── favicon.ico            # ShortAF favicon
├── src/
│   ├── pages/                 # React page components
│   │   ├── UrlShortenerPage.tsx   # Main URL shortening interface
│   │   ├── StatisticsPage.tsx     # Analytics dashboard
│   │   └── RedirectHandler.tsx    # URL redirection logic
│   ├── App.tsx                # Main application component & routing
│   ├── App.css                # Global styles and animations
│   ├── index.tsx              # Application entry point
│   ├── index.css              # Base CSS styles
│   └── logging.ts             # Logging middleware
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` → `#764ba2` (Beautiful gradient)
- **Secondary**: `#f093fb` → `#f5576c` (Vibrant accent)
- **Success**: `#4caf50` (Nature-inspired green)
- **Warning**: `#ff9800` (Energetic orange)
- **Error**: `#f44336` (Clear red)

### Typography
- **Font Family**: Inter, Roboto, system fonts
- **Headings**: Bold weights (600-700) for strong hierarchy
- **Body Text**: Regular weight (400) for optimal readability

### Components
- **Glass-morphism Cards**: Translucent backgrounds with blur effects
- **Gradient Buttons**: Smooth color transitions with hover animations
- **Modern Form Fields**: Clean inputs with floating labels
- **Animated Icons**: Micro-interactions for enhanced UX

## 🔥 Key Features Breakdown

### URL Shortening Engine
- **Algorithm**: Custom base62 encoding for short, readable URLs
- **Validation**: Real-time URL format validation with user feedback
- **Uniqueness**: Collision detection with automatic retry mechanism
- **Batch Processing**: Handle multiple URLs simultaneously

### Analytics Engine
- **Real-time Tracking**: Instant click registration and analytics
- **Data Visualization**: Beautiful charts and metrics cards
- **Performance Insights**: Click rates, popular URLs, and usage patterns
- **Export Capabilities**: Data export for external analysis

### User Experience
- **Micro-interactions**: Smooth animations for every user action
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Error Prevention**: Proactive validation to prevent user mistakes
- **Success Feedback**: Clear confirmation of successful actions

## 📱 Browser Support

ShortAF supports all modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## 🚢 Deployment

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify
3. Configure redirects for client-side routing

### Deploy to Vercel
1. Connect your GitHub repository
2. Vercel will automatically build and deploy
3. Zero configuration required!

### Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI Team** for the incredible component library
- **React Team** for the revolutionary frontend framework
- **TypeScript Team** for making JavaScript development enjoyable
- **Open Source Community** for continuous inspiration and support

## Screenshots

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/2b69f454-75f4-41d8-9493-b52e00c48511" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/2fff9b67-4a48-4048-9017-926d79dfde62" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/006b2a26-33d1-4dfa-8880-1eb0ec12a415" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/3e2538fc-159f-4454-a3f7-a990e1d75a89" />









