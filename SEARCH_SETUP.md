# Setting Up Search for Pixieset API Documentation

This guide explains how to enable search functionality for your Pixieset API documentation using Algolia DocSearch.

## Option 1: Apply for Free DocSearch (Recommended)

Algolia provides free search for open-source documentation projects through their DocSearch program.

### Prerequisites
- Your documentation must be publicly accessible
- The project should be open source
- Documentation should have good content structure

### Steps to Apply

1. **Go to the DocSearch Application Page**
   - Visit https://docsearch.algolia.com/apply/
   
2. **Fill Out the Application Form**
   - Documentation URL: `https://trozz.github.io/pixieset-api-docs/`
   - Email: Your email address
   - Repository URL: `https://github.com/trozz/pixieset-api-docs`

3. **Wait for Approval**
   - Algolia typically responds within a few days
   - They will provide you with:
     - Application ID (`appId`)
     - Search-Only API Key (`apiKey`)
     - Index Name (`indexName`)

4. **Update Configuration**
   Once approved, update `/docusaurus.config.ts`:
   ```typescript
   algolia: {
     appId: 'YOUR_PROVIDED_APP_ID',
     apiKey: 'YOUR_PROVIDED_API_KEY',
     indexName: 'YOUR_PROVIDED_INDEX_NAME',
     contextualSearch: true,
     searchPagePath: 'search',
   },
   ```

## Option 2: Self-Hosted Search (Alternative)

If you prefer not to use Algolia or need immediate search functionality, you can use the local search plugin.

### Install Local Search Plugin

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

### Update Configuration

Replace the Algolia configuration in `/docusaurus.config.ts` with:

```typescript
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
    },
  ],
],
```

### Remove Algolia Configuration

Comment out or remove the `algolia` section from the `themeConfig`.

## Option 3: Custom Algolia Account

If you have your own Algolia account or want immediate setup:

### 1. Create an Algolia Account
- Sign up at https://www.algolia.com/
- Create a new application

### 2. Create an Index
- Name it `pixieset-api-docs`
- Configure index settings

### 3. Set Up Crawler
Create a crawler configuration:

```javascript
new Crawler({
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_ADMIN_API_KEY', // Admin key for indexing
  rateLimit: 8,
  startUrls: [
    'https://trozz.github.io/pixieset-api-docs/',
  ],
  renderJavaScript: false,
  sitemaps: [
    'https://trozz.github.io/pixieset-api-docs/sitemap.xml',
  ],
  exclusionPatterns: [],
  ignoreCanonicalTo: false,
  discoveryPatterns: [
    'https://trozz.github.io/**',
  ],
  schedule: 'at 00:00 on Saturday',
  actions: [
    {
      indexName: 'pixieset-api-docs',
      pathsToMatch: ['https://trozz.github.io/pixieset-api-docs/**'],
      recordExtractor: ({ $, helpers }) => {
        return helpers.docsearch({
          recordProps: {
            lvl1: '.menu__link--sublist.menu__link--active',
            content: 'article p, article li',
            lvl0: {
              selectors: '',
              global: true,
              defaultValue: 'Documentation',
            },
            lvl2: 'article h2',
            lvl3: 'article h3',
            lvl4: 'article h4',
            lvl5: 'article h5',
          },
          indexHeadings: true,
        });
      },
    },
  ],
  initialIndexSettings: {
    'pixieset-api-docs': {
      attributesForFaceting: ['type', 'lang'],
      attributesToRetrieve: ['hierarchy', 'content', 'anchor', 'url'],
      attributesToHighlight: ['hierarchy', 'hierarchy_camel', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'hierarchy_radio', 'content'],
      searchableAttributes: [
        'unordered(hierarchy_radio_camel.lvl0)',
        'unordered(hierarchy_radio.lvl0)',
        'unordered(hierarchy_radio_camel.lvl1)',
        'unordered(hierarchy_radio.lvl1)',
        'unordered(hierarchy_radio_camel.lvl2)',
        'unordered(hierarchy_radio.lvl2)',
        'unordered(hierarchy_radio_camel.lvl3)',
        'unordered(hierarchy_radio.lvl3)',
        'unordered(hierarchy_radio_camel.lvl4)',
        'unordered(hierarchy_radio.lvl4)',
        'unordered(hierarchy_radio_camel.lvl5)',
        'unordered(hierarchy_radio.lvl5)',
        'unordered(hierarchy_radio_camel.lvl6)',
        'unordered(hierarchy_radio.lvl6)',
        'unordered(hierarchy_camel.lvl0)',
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy_camel.lvl1)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy_camel.lvl2)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy_camel.lvl3)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy_camel.lvl4)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy_camel.lvl5)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy_camel.lvl6)',
        'unordered(hierarchy.lvl6)',
        'content',
      ],
      distinct: true,
      attributeForDistinct: 'url',
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)',
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom',
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'allOptional',
    },
  },
});
```

### 4. Run the Crawler
- Use Algolia's crawler or set up your own
- Schedule regular crawls to keep the index updated

### 5. Update Configuration
Update `/docusaurus.config.ts` with your credentials:
```typescript
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY', // Search-only key
  indexName: 'pixieset-api-docs',
  contextualSearch: true,
  searchPagePath: 'search',
},
```

## Temporary Solution: Browser Search

Until search is configured, users can use:
- **Ctrl+F** (Windows/Linux) or **Cmd+F** (Mac) for in-page search
- The sidebar navigation to browse documentation
- The sitemap at `/sitemap.xml` for a complete list of pages

## Testing Search

Once configured:

1. **Build the site locally**:
   ```bash
   npm run build
   npm run serve
   ```

2. **Test search functionality**:
   - Click the search box in the navigation
   - Try searching for terms like "client", "invoice", "authentication"
   - Verify results link to correct pages

## Troubleshooting

### Search Not Appearing
- Ensure Algolia configuration is properly added to `docusaurus.config.ts`
- Check browser console for errors
- Verify API keys are correct

### No Search Results
- Wait for initial crawl to complete (can take up to 24 hours)
- Check if your site is accessible at the configured URL
- Verify crawler configuration matches your site structure

### Search Results Not Updated
- Check crawler schedule
- Manually trigger a re-crawl from Algolia dashboard
- Ensure sitemap is properly generated

## Next Steps

1. **Apply for DocSearch** (recommended for open source projects)
2. **Install local search** (for immediate functionality)
3. **Set up custom Algolia** (for full control)

Choose the option that best fits your needs and timeline.