# Pixieset API Documentation

Comprehensive API documentation for Pixieset Studio and Gallery APIs, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

### Installation

```bash
npm install
# or
yarn
```

### Local Development

```bash
npm start
# or
yarn start
```

This starts a local development server at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
# or
yarn build
```

This generates static content into the `build` directory for production deployment.

## 📚 Documentation Structure

```
docs/
├── intro.md                 # Getting started guide
├── authentication.md         # Authentication guide
├── studio-api/              # Studio API documentation
│   ├── overview.md          # Studio API overview
│   ├── clients.md           # Client management endpoints
│   └── ...                  # Additional endpoints
└── gallery-api/             # Gallery API documentation
    ├── overview.md          # Gallery API overview
    └── ...                  # Gallery endpoints
```

## 🚢 Deployment to GitHub Pages

### Option 1: Manual Deployment

Using SSH:
```bash
USE_SSH=true npm run deploy
```

Using HTTPS:
```bash
GIT_USER=trozz npm run deploy
```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### GitHub Pages Configuration

1. Go to Settings → Pages in your repository
2. Set Source to "Deploy from a branch"
3. Select `gh-pages` branch
4. Save the settings

Your site will be available at: `https://trozz.github.io/pixieset-api-docs/`

## 🔧 Configuration

Key configuration in `docusaurus.config.ts`:

```typescript
const config: Config = {
  title: 'Pixieset API Documentation',
  url: 'https://trozz.github.io',
  baseUrl: '/pixieset-api-docs/',
  organizationName: 'trozz',
  projectName: 'pixieset-api-docs',
  // ...
};
```

## 📝 Adding Documentation

1. Create new `.md` files in the appropriate directory
2. Add frontmatter for metadata:
   ```markdown
   ---
   sidebar_position: 1
   title: Your Page Title
   ---
   ```
3. Update `sidebars.ts` if needed
4. Follow existing patterns for consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Documentation for educational purposes.

## 🔗 Links

- [Live Documentation](https://trozz.github.io/pixieset-api-docs/)
- [Pixieset](https://pixieset.com)
- [Docusaurus](https://docusaurus.io)
