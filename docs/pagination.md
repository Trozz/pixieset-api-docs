---
sidebar_position: 4
title: Pagination
---

# Pagination

The Pixieset API uses pagination to handle large datasets efficiently. This guide explains how pagination works across different endpoints and how to implement it in your applications.

## Overview

Pagination helps manage API performance and response sizes by returning results in smaller chunks. The Pixieset API uses **page-based pagination** for most endpoints that return lists of resources.

## Pagination Parameters

Most list endpoints accept these standard pagination parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | The page number to retrieve (1-indexed) |
| `per_page` or `page_size` | integer | 25-50 | Number of items per page |
| `limit` | integer | varies | Alternative to per_page on some endpoints |

## Response Format

Paginated responses typically include a `meta` object with pagination details:

```json
{
  "data": [
    // Array of resources
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 156,
    "last_page": 7,
    "from": 1,
    "to": 25
  }
}
```

### Meta Fields Explained

| Field | Description |
|-------|-------------|
| `current_page` | Current page number |
| `per_page` | Items per page |
| `total` | Total number of items |
| `last_page` | Last page number |
| `from` | First item index on current page |
| `to` | Last item index on current page |

## Examples by API

### Studio API Pagination

#### Clients List
```http
GET /clients/?page=2&per_page=50
```

**Response:**
```json
{
  "data": [
    {
      "id": "cl_ABC123...",
      "first_name": "John",
      "last_name": "Doe"
    }
    // ... 49 more clients
  ],
  "meta": {
    "current_page": 2,
    "per_page": 50,
    "total": 234,
    "last_page": 5,
    "from": 51,
    "to": 100
  }
}
```

#### Invoices List
```http
GET /invoices/?page=1&per_page=25&expand=client
```

**Response:**
```json
{
  "data": [
    {
      "id": "in_DEF456...",
      "invoice_number": "INV-001",
      "amount": 50000,
      "client": {
        "id": "cl_ABC123...",
        "name": "John Doe"
      }
    }
    // ... more invoices
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 109,
    "last_page": 5
  }
}
```

#### Payments List
```http
GET /invoices/payments/list/?page_size=100&page=3
```

Note: Some endpoints use `page_size` instead of `per_page`.

### Gallery API Pagination

Gallery API endpoints may use different pagination patterns:

#### Collections List
```http
GET /collections?limit=30&offset=60
```

Some Gallery endpoints use offset-based pagination with `limit` and `offset` parameters.

## Implementation Patterns

### Basic Pagination Loop

Fetch all pages of results:

```javascript
async function getAllClients() {
  let allClients = [];
  let currentPage = 1;
  let hasMorePages = true;
  
  while (hasMorePages) {
    const response = await fetch(
      `https://studio.pixieset.com/api/v1/clients/?page=${currentPage}&per_page=100`,
      {
        credentials: 'include'
      }
    );
    
    const data = await response.json();
    allClients = allClients.concat(data.data);
    
    // Check if there are more pages
    hasMorePages = currentPage < data.meta.last_page;
    currentPage++;
  }
  
  return allClients;
}
```

### Pagination with User Controls

Implement pagination controls in your UI:

```javascript
class PaginatedList {
  constructor(endpoint, perPage = 25) {
    this.endpoint = endpoint;
    this.perPage = perPage;
    this.currentPage = 1;
    this.totalPages = 1;
    this.total = 0;
  }
  
  async fetchPage(page = 1) {
    const response = await fetch(
      `${this.endpoint}?page=${page}&per_page=${this.perPage}`,
      {
        credentials: 'include'
      }
    );
    
    const data = await response.json();
    
    // Update pagination state
    this.currentPage = data.meta.current_page;
    this.totalPages = data.meta.last_page;
    this.total = data.meta.total;
    
    return data.data;
  }
  
  async nextPage() {
    if (this.currentPage < this.totalPages) {
      return await this.fetchPage(this.currentPage + 1);
    }
    return null;
  }
  
  async previousPage() {
    if (this.currentPage > 1) {
      return await this.fetchPage(this.currentPage - 1);
    }
    return null;
  }
  
  async goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      return await this.fetchPage(page);
    }
    throw new Error('Page out of range');
  }
}

// Usage
const clientsList = new PaginatedList('/api/v1/clients/', 50);
const firstPage = await clientsList.fetchPage(1);
const nextPage = await clientsList.nextPage();
```

### Async Iterator Pattern

Modern JavaScript implementation using async iterators:

```javascript
class PaginatedAPI {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.perPage = options.perPage || 50;
    this.filters = options.filters || {};
  }
  
  async *[Symbol.asyncIterator]() {
    let currentPage = 1;
    let hasMore = true;
    
    while (hasMore) {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: this.perPage,
        ...this.filters
      });
      
      const response = await fetch(`${this.endpoint}?${params}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      // Yield each item
      for (const item of data.data) {
        yield item;
      }
      
      // Check if more pages exist
      hasMore = currentPage < data.meta.last_page;
      currentPage++;
    }
  }
}

// Usage with async iteration
const clients = new PaginatedAPI('/api/v1/clients/', { perPage: 100 });

for await (const client of clients) {
  console.log(client.first_name, client.last_name);
}
```

### React Hook for Pagination

```javascript
import { useState, useEffect, useCallback } from 'react';

function usePagination(endpoint, perPage = 25) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    lastPage: 1,
    currentPage: 1
  });
  
  const fetchPage = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${endpoint}?page=${pageNumber}&per_page=${perPage}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result.data);
      setMeta({
        total: result.meta.total,
        lastPage: result.meta.last_page,
        currentPage: result.meta.current_page
      });
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, perPage]);
  
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);
  
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= meta.lastPage) {
      fetchPage(pageNumber);
    }
  };
  
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);
  
  return {
    data,
    loading,
    error,
    page,
    meta,
    goToPage,
    nextPage,
    prevPage,
    hasNext: page < meta.lastPage,
    hasPrev: page > 1
  };
}

// React component usage
function ClientList() {
  const {
    data: clients,
    loading,
    error,
    page,
    meta,
    nextPage,
    prevPage,
    hasNext,
    hasPrev
  } = usePagination('/api/v1/clients/', 50);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Clients (Page {page} of {meta.lastPage})</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            {client.first_name} {client.last_name}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={prevPage} disabled={!hasPrev}>
          Previous
        </button>
        <span>
          Page {page} of {meta.lastPage} (Total: {meta.total})
        </span>
        <button onClick={nextPage} disabled={!hasNext}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Performance Considerations

### Optimal Page Size

Choose page size based on your use case:

- **Small (10-25)**: Interactive UIs, mobile apps
- **Medium (50-100)**: Desktop applications, data tables
- **Large (100-500)**: Batch processing, data exports

```javascript
// Adaptive page size based on context
function getOptimalPageSize(context) {
  const pageSizes = {
    mobile: 10,
    desktop: 50,
    export: 200,
    batch: 500
  };
  
  return pageSizes[context] || 25;
}
```

### Caching Strategies

Implement caching to reduce API calls:

```javascript
class CachedPaginatedAPI {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }
  
  getCacheKey(page, perPage, filters = {}) {
    return `${page}-${perPage}-${JSON.stringify(filters)}`;
  }
  
  async fetchPage(page, perPage = 25, filters = {}) {
    const cacheKey = this.getCacheKey(page, perPage, filters);
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    // Fetch fresh data
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      ...filters
    });
    
    const response = await fetch(`${this.endpoint}?${params}`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

### Parallel Fetching

Fetch multiple pages simultaneously when appropriate:

```javascript
async function fetchPagesInParallel(endpoint, startPage, endPage, perPage = 50) {
  const pagePromises = [];
  
  for (let page = startPage; page <= endPage; page++) {
    pagePromises.push(
      fetch(`${endpoint}?page=${page}&per_page=${perPage}`, {
        credentials: 'include'
      }).then(res => res.json())
    );
  }
  
  const results = await Promise.all(pagePromises);
  
  // Combine all results
  return results.reduce((all, result) => {
    return all.concat(result.data);
  }, []);
}

// Fetch pages 1-5 in parallel
const allData = await fetchPagesInParallel('/api/v1/clients/', 1, 5);
```

## Common Patterns

### Load More Button

```javascript
class LoadMoreList {
  constructor(endpoint, perPage = 25) {
    this.endpoint = endpoint;
    this.perPage = perPage;
    this.currentPage = 0;
    this.allItems = [];
    this.hasMore = true;
  }
  
  async loadMore() {
    if (!this.hasMore) return [];
    
    this.currentPage++;
    const response = await fetch(
      `${this.endpoint}?page=${this.currentPage}&per_page=${this.perPage}`,
      { credentials: 'include' }
    );
    
    const data = await response.json();
    this.allItems = this.allItems.concat(data.data);
    this.hasMore = this.currentPage < data.meta.last_page;
    
    return data.data;
  }
  
  reset() {
    this.currentPage = 0;
    this.allItems = [];
    this.hasMore = true;
  }
}
```

### Infinite Scroll

```javascript
class InfiniteScroll {
  constructor(endpoint, container, renderItem) {
    this.endpoint = endpoint;
    this.container = container;
    this.renderItem = renderItem;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    
    this.setupObserver();
  }
  
  setupObserver() {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver(
      entries => this.handleIntersection(entries),
      options
    );
    
    // Create and observe sentinel element
    this.sentinel = document.createElement('div');
    this.sentinel.className = 'loading-sentinel';
    this.container.appendChild(this.sentinel);
    this.observer.observe(this.sentinel);
  }
  
  async handleIntersection(entries) {
    const entry = entries[0];
    
    if (entry.isIntersecting && !this.loading && this.hasMore) {
      await this.loadMore();
    }
  }
  
  async loadMore() {
    this.loading = true;
    
    try {
      const response = await fetch(
        `${this.endpoint}?page=${this.page}&per_page=25`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      // Render new items
      data.data.forEach(item => {
        const element = this.renderItem(item);
        this.container.insertBefore(element, this.sentinel);
      });
      
      // Update state
      this.hasMore = this.page < data.meta.last_page;
      this.page++;
      
      if (!this.hasMore) {
        this.observer.disconnect();
        this.sentinel.remove();
      }
    } finally {
      this.loading = false;
    }
  }
}

// Usage
const scroll = new InfiniteScroll(
  '/api/v1/clients/',
  document.getElementById('client-list'),
  client => {
    const div = document.createElement('div');
    div.textContent = `${client.first_name} ${client.last_name}`;
    return div;
  }
);
```

## Error Handling in Pagination

Handle pagination-specific errors gracefully:

```javascript
async function safePaginatedFetch(endpoint, page, perPage) {
  try {
    const response = await fetch(
      `${endpoint}?page=${page}&per_page=${perPage}`,
      { credentials: 'include' }
    );
    
    if (!response.ok) {
      if (response.status === 404 && page > 1) {
        // Page doesn't exist, probably exceeded last page
        return {
          data: [],
          meta: {
            current_page: page,
            per_page: perPage,
            total: 0,
            last_page: page - 1
          }
        };
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Pagination error:', error);
    
    // Return empty result set on error
    return {
      data: [],
      meta: {
        current_page: page,
        per_page: perPage,
        total: 0,
        last_page: 0,
        error: error.message
      }
    };
  }
}
```

## Best Practices

### 1. Choose Appropriate Page Sizes

```javascript
// Adjust page size based on data complexity
const PAGE_SIZES = {
  simple: 100,    // Simple objects with few fields
  medium: 50,     // Moderate complexity
  complex: 25,    // Complex nested objects
  detailed: 10    // Very detailed with expansions
};

// Example for invoices with expanded data
const invoices = await fetch(
  '/api/v1/invoices/?page=1&per_page=25&expand=all'
);
```

### 2. Provide Clear Navigation

Always show pagination context to users:

```javascript
function PaginationInfo({ current, total, perPage, totalItems }) {
  const from = (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, totalItems);
  
  return (
    <div>
      Showing {from}-{to} of {totalItems} items
      (Page {current} of {total})
    </div>
  );
}
```

### 3. Handle Edge Cases

```javascript
function validatePageNumber(page, lastPage) {
  // Ensure page is within valid range
  if (page < 1) return 1;
  if (page > lastPage) return lastPage;
  return page;
}
```

### 4. Implement Progressive Loading

```javascript
// Load first page immediately, prefetch next page
async function progressiveLoad(endpoint) {
  // Load and display first page
  const firstPage = await fetch(`${endpoint}?page=1&per_page=50`);
  displayResults(firstPage.data);
  
  // Prefetch second page in background
  if (firstPage.meta.last_page > 1) {
    fetch(`${endpoint}?page=2&per_page=50`)
      .then(res => res.json())
      .then(data => cacheResults(2, data));
  }
}
```

### 5. Remember User Preferences

```javascript
// Save and restore pagination preferences
class PaginationPreferences {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }
  
  save(page, perPage) {
    localStorage.setItem(this.storageKey, JSON.stringify({
      page,
      perPage,
      timestamp: Date.now()
    }));
  }
  
  restore() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return { page: 1, perPage: 25 };
    
    const prefs = JSON.parse(stored);
    
    // Only restore if less than 1 hour old
    if (Date.now() - prefs.timestamp < 3600000) {
      return { page: prefs.page, perPage: prefs.perPage };
    }
    
    return { page: 1, perPage: 25 };
  }
}
```

## Summary

Pagination is essential for working with large datasets in the Pixieset API:

1. **Understand the parameters** - Use `page` and `per_page`/`page_size` correctly
2. **Parse meta information** - Extract pagination details from responses
3. **Implement proper controls** - Provide intuitive navigation for users
4. **Optimize performance** - Use appropriate page sizes and caching
5. **Handle errors gracefully** - Account for invalid pages and network issues
6. **Consider UX patterns** - Choose between traditional pagination, load more, or infinite scroll

Remember that pagination parameters and response formats may vary slightly between endpoints, so always refer to the specific endpoint documentation.

## Related Documentation

- [Error Handling](/docs/error-handling) - Handle pagination errors
- [Best Practices](/docs/best-practices) - General API usage guidelines
- [Authentication](/docs/authentication) - Maintain sessions across pages