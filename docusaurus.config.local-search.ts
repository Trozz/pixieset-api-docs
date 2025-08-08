import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This configuration uses local search instead of Algolia
// To use: rename this file to docusaurus.config.ts after installing the local search plugin

const config: Config = {
  title: 'Pixieset API Documentation',
  tagline: 'Comprehensive API documentation for Pixieset Studio and Gallery APIs',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://trozz.github.io',
  baseUrl: '/pixieset-api-docs/',

  organizationName: 'trozz',
  projectName: 'pixieset-api-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/trozz/pixieset-api-docs/tree/main/',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        indexDocs: true,
        indexDocSidebarParentCategories: 0,
        indexBlog: false,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        removeDefaultStemmer: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
        searchBarShortcutHint: true,
        searchBarPosition: "right",
        docsRouteBasePath: "/docs",
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Pixieset API',
      logo: {
        alt: 'Pixieset API Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Documentation',
        },
        {
          type: 'dropdown',
          label: 'APIs',
          position: 'left',
          items: [
            {
              label: 'Studio API',
              to: '/docs/studio-api/overview',
            },
            {
              label: 'Gallery API',
              to: '/docs/gallery-api/overview',
            },
          ],
        },
        {
          href: 'https://github.com/trozz/pixieset-api-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Studio API',
              to: '/docs/studio-api/overview',
            },
            {
              label: 'Gallery API',
              to: '/docs/gallery-api/overview',
            },
          ],
        },
        {
          title: 'API References',
          items: [
            {
              label: 'Authentication',
              to: '/docs/authentication',
            },
            {
              label: 'Error Handling',
              to: '/docs/error-handling',
            },
            {
              label: 'Pagination',
              to: '/docs/pagination',
            },
            {
              label: 'Best Practices',
              to: '/docs/best-practices',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/trozz/pixieset-api-docs',
            },
            {
              label: 'Pixieset',
              href: 'https://pixieset.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pixieset API Documentation. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'ruby', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;