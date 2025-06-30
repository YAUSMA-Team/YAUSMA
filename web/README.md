# YAUSMA Web Frontend

## Overview
YAUSMA (Your Advanced User Stock Market Analysis) is a modern web application for stock market analysis and portfolio management. This frontend application integrates with a Rust backend API and various external stock market data providers.

## Project Structure
```
web/
├── index.html                    # Main landing page
├── pages/                       # Individual page templates
├── css/                        # Stylesheets
│   ├── main.css               # Core styles
│   ├── components.css         # Reusable component styles
│   └── themes/               # Theme configurations
├── js/                        # JavaScript files
│   ├── main.js              # Core application logic
│   ├── config.js            # Configuration and constants
│   ├── components/          # Reusable UI components
│   └── utils/              # Helper functions
└── assets/                   # Static assets
```

## Setup Instructions

1. Clone the repository
2. Configure API endpoints in `js/config.js`
3. Set up environment variables for API keys
4. Serve the application using a local development server

### Development Server
You can use any of these methods to serve the application locally:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8080
```

## Features

- Responsive design using Bootstrap 5
- Light/Dark theme support
- Real-time stock data integration
- User authentication
- Portfolio management
- News integration
- Pro version features

## API Integration

### Backend API (Rust)
- Authentication endpoints
- User management
- Portfolio data

### External APIs
- Marketstack API for stock data
- News API for financial news
- Alpha Vantage for additional market data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

1. Follow the established directory structure
2. Use CSS variables for theming
3. Implement responsive design patterns
4. Handle loading and error states
5. Implement proper security measures

## Security Considerations

- API keys are never exposed in frontend code
- User authentication tokens stored securely
- Input validation and sanitization
- CSRF protection
- XSS prevention

## Performance Optimization

- Lazy loading of assets
- Caching strategies
- Debounced API calls
- Minified production assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See LICENSE file for details 