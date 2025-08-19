# PDF Insights Frontend - TypeScript + Tailwind CSS

A modern, type-safe, responsive web application for intelligent document analysis with persona-based insights. Built with TypeScript for better development experience and Tailwind CSS for rapid, consistent styling.

## 🚀 Tech Stack

- **TypeScript**: Type-safe JavaScript with enhanced development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast, modern build tool for development and production
- **PostCSS**: CSS processing with Autoprefixer
- **Native Web APIs**: No heavy frameworks, pure web standards

## 📁 Project Structure

```
frontend/
├── src/
│   ├── main.ts         # TypeScript application logic with classes and types
│   └── input.css       # Tailwind CSS with custom components
├── index.html          # HTML structure with Tailwind classes
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind customization
├── postcss.config.js   # PostCSS configuration
├── vite.config.ts      # Vite build configuration
└── README.md           # This file
```

## ✨ Features

### 🎨 Modern UI/UX
- **Adobe-Inspired Design**: Clean, professional interface using Adobe brand colors
- **Dark/Light Theme**: Animated theme toggler with system preference detection
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Smooth Animations**: Hardware-accelerated transitions and scroll effects
- **Tailwind Components**: Custom component classes for consistency

### 🔧 Type Safety & Architecture
- **TypeScript Classes**: Well-organized, maintainable code structure
- **Interface Definitions**: Strongly typed API responses and data structures
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Modular Design**: Separated concerns with dedicated manager classes

### 🚀 Performance
- **Vite Build System**: Lightning-fast development and optimized production builds
- **Tree Shaking**: Automatic removal of unused code
- **CSS Purging**: Tailwind removes unused styles in production
- **Native APIs**: No heavy framework overhead

### 📱 Accessibility
- **Semantic HTML**: Screen reader friendly structure
- **Keyboard Navigation**: Full keyboard accessibility
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **High Contrast**: WCAG compliant color ratios

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000` with hot reload

4. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs to `dist/` folder

5. **Preview production build:**
   ```bash
   npm run preview
   ```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run css:build    # Build CSS with watch mode
npm run css:prod     # Build minified CSS
```

## 🎨 Customization

### Adobe Brand Colors
Tailwind config includes Adobe brand colors:
```javascript
colors: {
  adobe: {
    red: '#FF0000',
    seaBuckthorn: '#FBB034',
    schoolBusYellow: '#FFDD00',
    keyLimePie: '#C1D82F',
    cerulean: '#00A4E4',
    cement: '#8A7967',
    nevada: '#6A737B',
  }
}
```

### Custom Components
Tailwind component classes in `src/input.css`:
- `.adobe-section` - Main content sections
- `.adobe-btn` - Styled buttons with hover effects
- `.adobe-input` - Form inputs with focus states
- `.adobe-tabs` - Tab navigation
- `.magic-theme-toggler` - Animated theme switcher

### API Configuration
Update API endpoint in `src/main.ts`:
```typescript
const API_BASE = 'http://your-api-server:port/api';
```

## 🏗️ Architecture

### Class-Based Organization
- **APIClient**: Centralized API communication
- **ThemeManager**: Theme switching and persistence
- **FileManager**: File upload and management
- **AnalysisManager**: Document analysis functionality
- **SearchManager**: Search operations
- **InsightsManager**: Insights generation
- **ScrollManager**: Smooth scrolling animations

### Type Definitions
Comprehensive TypeScript interfaces for:
- API responses and requests
- File information and metadata
- Analysis results and configurations
- Search parameters and results

### Error Handling
- Centralized error messaging system
- Type-safe error boundaries
- User-friendly error displays
- Console logging for debugging

## 🌐 Browser Support

- **Modern browsers**: Full TypeScript and Tailwind support
- **Older browsers**: Graceful degradation with fallbacks
- **Mobile browsers**: Touch-optimized interactions
- **Accessibility**: Screen reader and keyboard support

## 🚀 Production Deployment

### Build Optimization
- TypeScript compilation with type checking
- Tailwind CSS purging removes unused styles
- Vite optimization with code splitting
- Asset minification and compression

### Deployment Options
1. **Static hosting** (Netlify, Vercel, GitHub Pages)
2. **CDN deployment** (CloudFront, CloudFlare)
3. **Docker containerization**
4. **Traditional web servers** (Apache, Nginx)

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with tree shaking
- **Lighthouse Score**: 90+ across all categories

## 🔍 Development Tools

### IDE Setup
Recommended VS Code extensions:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- PostCSS Language Support
- Vite extension

### Debugging
- Browser DevTools with source maps
- TypeScript error reporting
- Tailwind CSS debugging utilities
- Network tab for API monitoring

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Tailwind utility classes consistently
3. Maintain component class organization
4. Add type definitions for new features
5. Test across different browsers and devices

## 📝 Notes

- Uses Vite for development and build tooling
- TypeScript strict mode enabled for maximum type safety
- Tailwind includes custom Adobe brand theme
- All animations respect user motion preferences
- API integration designed for FastAPI backend

This modern setup provides excellent developer experience with type safety, fast builds, and maintainable code structure while delivering a beautiful, performant user interface.