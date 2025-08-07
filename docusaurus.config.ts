import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Pixieset API Documentation',
  tagline: 'Comprehensive API documentation for Pixieset Studio and Gallery APIs',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://trozz.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/pixieset-api-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'trozz', // Usually your GitHub org/user name.
  projectName: 'pixieset-api-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/trozz/pixieset-api-docs/tree/main/',
          routeBasePath: 'docs',
        },
        blog: false, // Disable blog feature for API documentation
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
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
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
