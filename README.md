# Pixieset API Documentation (Unofficial)

[![Documentation](https://img.shields.io/badge/docs-live-brightgreen)](https://trozz.github.io/pixieset-api-docs/)
[![Endpoints Documented](https://img.shields.io/badge/endpoints-111%2B-blue)](https://trozz.github.io/pixieset-api-docs/docs/intro)
[![Languages](https://img.shields.io/badge/languages-JS%20%7C%20Python%20%7C%20PHP%20%7C%20Ruby-orange)](https://trozz.github.io/pixieset-api-docs/docs/quickstart)
[![Status](https://img.shields.io/badge/status-unofficial-yellow)](https://trozz.github.io/pixieset-api-docs/)

Comprehensive, reverse-engineered API documentation for Pixieset Studio and Gallery APIs. This unofficial documentation provides developers with detailed endpoint references, authentication guides, and practical code examples for building integrations with Pixieset's photography business management platform.

## 🚨 Important Disclaimer

**This is UNOFFICIAL documentation** created through reverse engineering and API analysis. This project is:
- Not affiliated with, endorsed by, or supported by Pixieset
- Subject to breaking changes as Pixieset updates their APIs
- Provided "as-is" without any warranties or guarantees
- For educational and development purposes only

Use at your own risk. Always test thoroughly and implement proper error handling.

## 📚 Documentation

Visit the full documentation at: **[https://trozz.github.io/pixieset-api-docs/](https://trozz.github.io/pixieset-api-docs/)**

## ✨ Features

### Comprehensive API Coverage
- **111+ endpoints documented** across Studio and Gallery APIs
- **Studio API (82 endpoints)**: Client management, invoicing, contracts, sessions, and more
- **Gallery API (29 endpoints)**: Collections, downloads, sharing, and media management

### Developer-Friendly Documentation
- 📖 **Quick Start Guide** - Get up and running in minutes
- 🔐 **Authentication Guide** - Session-based auth with cookie management
- 🔄 **Pagination Guide** - Handle large datasets efficiently
- ⚠️ **Error Handling** - Comprehensive error recovery strategies
- ✅ **Best Practices** - Production-ready integration patterns

### Multi-Language Support
Code examples provided in:
- **JavaScript** (Node.js/Browser)
- **Python** (requests library)
- **PHP** (cURL)
- **Ruby** (Net::HTTP)
- **cURL** (Command line)

### Ready for Deployment
- 🚀 GitHub Pages deployment configured
- 🔍 Search functionality (Algolia/Local search)
- 📱 Mobile-responsive design
- 🌙 Dark mode support

## 🚀 Quick Start

### Basic API Call Example

```javascript
// Fetch clients from Studio API
const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

const clients = await response.json();
console.log(`Found ${clients.data.length} clients`);
```

For more examples and detailed guides, visit the [Quick Start Guide](https://trozz.github.io/pixieset-api-docs/docs/quickstart).

## 📋 API Coverage

### Studio API Endpoints
- **Clients & CRM** - Complete CRUD operations for client management
- **Invoices & Payments** - Financial management and payment processing
- **Contracts** - Digital contracts and signatures
- **Sessions & Scheduling** - Booking and calendar management
- **Conversations** - Client messaging system
- **Coupons & Discounts** - Promotional tools
- **Templates** - Reusable document templates
- **Questionnaires** - Client information gathering

### Gallery API Endpoints
- **Collections** - Photo collection management
- **Downloads** - Track and manage downloads
- **Sharing** - Client access and permissions

## 🛠️ Local Development

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/trozz/pixieset-api-docs.git
cd pixieset-api-docs

# Install dependencies
npm install

# Start development server
npm start
```

The documentation will be available at `http://localhost:3000/pixieset-api-docs/`

### Building for Production

```bash
# Build static site
npm run build

# Test production build locally
npm run serve
```

## 🔍 Enabling Search

The documentation supports multiple search options:

1. **Algolia DocSearch** (Recommended for production)
   - Apply at [https://docsearch.algolia.com/](https://docsearch.algolia.com/)
   - Update credentials in `docusaurus.config.ts`

2. **Local Search** (Immediate availability)
   ```bash
   npm install @easyops-cn/docusaurus-search-local
   ```
   Then use `docusaurus.config.local-search.ts`

See [SEARCH_SETUP.md](SEARCH_SETUP.md) for detailed instructions.

## 🚢 Deployment

The repository includes GitHub Actions workflows for automatic deployment to GitHub Pages:

1. Push to `main` branch
2. GitHub Actions builds the documentation
3. Deploys to GitHub Pages automatically

See [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) for manual deployment options.

## 🤝 Contributing

Contributions are welcome! As this is reverse-engineered documentation, we especially appreciate:

- 🐛 **Bug Reports** - Found an incorrect endpoint or parameter?
- 📝 **Documentation Updates** - Discovered new endpoints or features?
- 💻 **Code Examples** - Have examples in other languages?
- 🔧 **Fixes** - Found typos or broken links?

Please open an issue or submit a pull request.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-addition`)
3. Make your changes
4. Test the build (`npm run build`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-addition`)
7. Open a Pull Request

## ⚖️ Legal

This project is not affiliated with, endorsed by, or supported by Pixieset. All product names, logos, and brands are property of their respective owners.

This documentation is created for educational purposes and to help developers integrate with Pixieset's services. Use of the Pixieset API should comply with Pixieset's terms of service.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Deployed with [GitHub Pages](https://pages.github.com/)
- Search powered by [Algolia DocSearch](https://docsearch.algolia.com/) (when configured)

## 📊 Stats

- **Documentation Pages**: 15+
- **Endpoints Documented**: 111+
- **Code Examples**: 50+
- **ID Format Patterns**: 25+
- **Languages Supported**: 5

## 🔗 Links

- **Documentation**: [https://trozz.github.io/pixieset-api-docs/](https://trozz.github.io/pixieset-api-docs/)
- **Issues**: [GitHub Issues](https://github.com/trozz/pixieset-api-docs/issues)
- **Pixieset**: [https://pixieset.com](https://pixieset.com) (Official website)

---

**Remember**: This is unofficial documentation. Always test thoroughly and implement proper error handling when building integrations.