# Base XTech Landing

Landing website for Base XTech company - Shopify solutions and web application development.

## 🚀 Technologies

- **Build Tool**: Vite
- **Template Engine**: EJS
- **Styling**: SCSS/CSS
- **JavaScript**: ES6+ Modules
- **Node.js**: v18+
- **Package Manager**: npm

## 📁 Project Structure

```
├── pages/              # English pages
├── uk/pages/          # Ukrainian pages
├── layout/            # EJS templates and components
├── src/              # JavaScript and styles
├── public/           # Static files (robots.txt, .htaccess)
├── dist/             # Generated build
└── .github/workflows/ # GitHub Actions
```

## 🛠 Local Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

Website will be available at: `http://localhost:3000`

### Build Project
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🌐 Multi-language Support

Project supports two languages:
- **English** (default): `/`
- **Ukrainian**: `/uk/`

Language switcher automatically detects current language and saves user preference in localStorage.

## 🚀 Deployment

Project uses GitHub Actions for automated deployment:

### Shared Secrets
- `REMOTE_KEY` - SSH private key
- `REMOTE_HOST` - Server address
- `REMOTE_USER` - SSH username

### Staging Environment
- **Trigger**: Push to `staging` branch
- **Path**: `REMOTE_PATH`

### Production Environment (Live)
- **Trigger**: Push to `live` branch
- **Path**: `REMOTE_LIVE_PATH`

### Deployment Process
1. Checkout code
2. Setup Node.js and install dependencies
3. Build project (`npm run build`)
4. Generate sitemap.xml
5. Deploy via rsync to server

## 🔍 SEO Features

### Sitemap
Automatically generates `sitemap.xml` for all pages in both languages during build process.

### Robots.txt
Located in `public/robots.txt` and automatically copied to build output.

### .htaccess
Configured redirects:
- From `www` to non-`www`
- From `index.html` to root

## 🏃‍♂️ Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build project
npm run preview      # Preview build

# Utilities
node generate-sitemap.js  # Manual sitemap generation
```

## 📝 Contributing

1. Create a new branch from `main`
2. Make your changes
3. Create PR to `staging` for testing
4. After testing - merge to `live` for production

## 🔧 Environment Setup

Required for development:
- Node.js v18+
- npm
- Git

Additional requirements for deployment:
- SSH access to servers
- Configured GitHub Secrets

## 📞 Contact

- **Website**: [base-xtech.com](https://base-xtech.com)
- **Staging**: staging.base-xtech.com (if available)

---

Made with ❤️ by Base XTech Team
