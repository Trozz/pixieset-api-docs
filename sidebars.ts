import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  apiSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'quickstart',
      label: 'Quick Start',
    },
    {
      type: 'doc',
      id: 'authentication',
      label: 'Authentication',
    },
    {
      type: 'doc',
      id: 'error-handling',
      label: 'Error Handling',
    },
    {
      type: 'doc',
      id: 'pagination',
      label: 'Pagination',
    },
    {
      type: 'doc',
      id: 'best-practices',
      label: 'Best Practices',
    },
    {
      type: 'doc',
      id: 'id-formats',
      label: 'ID Format Reference',
    },
    {
      type: 'category',
      label: 'Studio API',
      collapsed: false,
      items: [
        'studio-api/overview',
        'studio-api/clients',
        'studio-api/sessions',
        'studio-api/invoices',
        'studio-api/contracts',
        'studio-api/conversations',
        'studio-api/coupons',
        'studio-api/templates',
        'studio-api/questionnaires',
      ],
    },
    {
      type: 'category',
      label: 'Gallery API',
      collapsed: false,
      items: [
        'gallery-api/overview',
        'gallery-api/collections',
        'gallery-api/downloads',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Pixieset Website',
          href: 'https://pixieset.com',
        },
        {
          type: 'link',
          label: 'Status Page',
          href: 'https://status.pixieset.com',
        },
      ],
    },
  ],
};

export default sidebars;
