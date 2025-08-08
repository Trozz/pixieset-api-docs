---
sidebar_position: 5
title: Best Practices
---

# Best Practices

This guide provides recommended practices for working with the Pixieset API to build reliable, efficient, and maintainable integrations.

## Important Disclaimer

⚠️ **This is unofficial, reverse-engineered documentation**. The Pixieset API:
- Is not officially documented or supported
- May change without notice
- Has no guaranteed SLA or stability
- Should be used at your own risk

Always implement defensive programming and graceful error handling.

## Authentication Best Practices

### 1. Secure Session Management

Store and handle session cookies securely:

```javascript
// ✅ Good: Use secure cookie handling
const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
  credentials: 'include', // Include cookies
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// ❌ Bad: Storing cookies in JavaScript variables
const sessionCookie = document.cookie; // Avoid this
```

### 2. Handle Session Expiry

Implement automatic session renewal:

```javascript
class PixiesetClient {
  async makeRequest(url, options = {}) {
    let response = await fetch(url, {
      ...options,
      credentials: 'include'
    });
    
    // Retry once on authentication failure
    if (response.status === 401) {
      await this.refreshSession();
      response = await fetch(url, {
        ...options,
        credentials: 'include'
      });
    }
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }
  
  async refreshSession() {
    // Implement re-authentication logic
    console.log('Session expired, please re-authenticate');
    // Redirect to login or refresh token
  }
}
```

### 3. CSRF Protection

Include CSRF tokens when required:

```javascript
// Get CSRF token from meta tag or cookie
function getCSRFToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : null;
}

// Include in requests
const response = await fetch('/api/v1/clients/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCSRFToken()
  },
  credentials: 'include',
  body: JSON.stringify(data)
});
```

## API Request Best Practices

### 1. Use Proper HTTP Methods

Follow RESTful conventions:

```javascript
// ✅ Good: Use appropriate HTTP methods
await fetch('/api/v1/clients/', { method: 'GET' });    // List/Read
await fetch('/api/v1/clients/', { method: 'POST' });   // Create
await fetch('/api/v1/clients/123', { method: 'PUT' }); // Update
await fetch('/api/v1/clients/123', { method: 'DELETE' }); // Delete

// ❌ Bad: Using GET for modifications
await fetch('/api/v1/clients/delete?id=123'); // Don't do this
```

### 2. Always Validate IDs

Validate resource IDs before making requests:

```javascript
class IDValidator {
  static patterns = {
    client: /^cl_[A-Za-z0-9]{30}$/,
    invoice: /^in_[A-Za-z0-9]{30}$/,
    payment: /^ip_[A-Za-z0-9]{30}$/,
    contract: /^co_[A-Za-z0-9]{30}$/,
    session: /^ses_[A-Za-z0-9]{30}$/
  };
  
  static validate(id, type) {
    const pattern = this.patterns[type];
    if (!pattern) {
      throw new Error(`Unknown resource type: ${type}`);
    }
    
    if (!pattern.test(id)) {
      throw new Error(`Invalid ${type} ID format: ${id}`);
    }
    
    return true;
  }
}

// Usage
try {
  IDValidator.validate(clientId, 'client');
  const response = await fetch(`/api/v1/clients/${clientId}`);
} catch (error) {
  console.error('Invalid ID:', error.message);
}
```

### 3. Handle Monetary Values Correctly

Always work with amounts in smallest currency units:

```javascript
class CurrencyHandler {
  // Convert display amount to API amount (smallest unit)
  static toApiAmount(displayAmount, currency) {
    const multipliers = {
      usd: 100, // cents
      gbp: 100, // pence
      eur: 100, // cents
      jpy: 1    // no decimal
    };
    
    const multiplier = multipliers[currency.toLowerCase()] || 100;
    return Math.round(displayAmount * multiplier);
  }
  
  // Convert API amount to display amount
  static toDisplayAmount(apiAmount, currency) {
    const divisors = {
      usd: 100,
      gbp: 100,
      eur: 100,
      jpy: 1
    };
    
    const divisor = divisors[currency.toLowerCase()] || 100;
    return apiAmount / divisor;
  }
  
  // Format for display
  static format(apiAmount, currency) {
    const displayAmount = this.toDisplayAmount(apiAmount, currency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(displayAmount);
  }
}

// Usage
const invoiceAmount = CurrencyHandler.toApiAmount(150.50, 'usd'); // 15050
const display = CurrencyHandler.format(15050, 'usd'); // "$150.50"
```

## Performance Optimization

### 1. Use Field Expansion Wisely

Only request the data you need:

```javascript
// ✅ Good: Request only needed expansions
const response = await fetch('/api/v1/invoices/?expand=client');

// ❌ Bad: Always requesting all expansions
const response = await fetch('/api/v1/invoices/?expand=all');
```

### 2. Implement Caching

Cache frequently accessed, rarely changing data:

```javascript
class APICache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage with API calls
const cache = new APICache();

async function getClient(clientId) {
  const cacheKey = `client_${clientId}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch from API
  const response = await fetch(`/api/v1/clients/${clientId}`);
  const data = await response.json();
  
  // Cache the result
  cache.set(cacheKey, data);
  
  return data;
}
```

### 3. Batch Operations

Minimize API calls by batching operations:

```javascript
class BatchProcessor {
  constructor(processFn, batchSize = 10, delay = 100) {
    this.queue = [];
    this.processFn = processFn;
    this.batchSize = batchSize;
    this.delay = delay;
    this.timeout = null;
  }
  
  add(item) {
    this.queue.push(item);
    
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }
  
  scheduleFlush() {
    if (this.timeout) return;
    
    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }
  
  async flush() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.batchSize);
    clearTimeout(this.timeout);
    this.timeout = null;
    
    await this.processFn(batch);
    
    // Process remaining items
    if (this.queue.length > 0) {
      this.scheduleFlush();
    }
  }
}

// Usage
const batchUpdater = new BatchProcessor(async (clients) => {
  // Process multiple clients in one request
  const updates = clients.map(c => ({
    id: c.id,
    updates: c.updates
  }));
  
  await fetch('/api/v1/clients/batch', {
    method: 'PUT',
    body: JSON.stringify({ clients: updates })
  });
});

// Add updates to batch
batchUpdater.add({ id: 'cl_123', updates: { status: 'active' } });
batchUpdater.add({ id: 'cl_456', updates: { status: 'active' } });
```

## Error Handling Strategies

### 1. Implement Retry Logic

Use exponential backoff for transient failures:

```javascript
async function retryableRequest(url, options, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry client errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors
      if (error.message.includes('Client error')) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### 2. Graceful Degradation

Provide fallback behavior when API is unavailable:

```javascript
class ResilientAPIClient {
  constructor() {
    this.offline = false;
    this.queue = [];
  }
  
  async request(url, options) {
    if (this.offline) {
      return this.handleOffline(url, options);
    }
    
    try {
      const response = await fetch(url, options);
      this.offline = false;
      return response;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        this.offline = true;
        return this.handleOffline(url, options);
      }
      throw error;
    }
  }
  
  handleOffline(url, options) {
    // Queue modifications for later
    if (options.method !== 'GET') {
      this.queue.push({ url, options, timestamp: Date.now() });
      return { ok: true, offline: true };
    }
    
    // Return cached data for reads
    const cached = this.getCachedData(url);
    if (cached) {
      return { ok: true, json: async () => cached };
    }
    
    throw new Error('Offline: No cached data available');
  }
  
  async syncQueue() {
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      try {
        await fetch(request.url, request.options);
      } catch (error) {
        // Re-queue on failure
        this.queue.unshift(request);
        throw error;
      }
    }
  }
}
```

## Data Validation

### 1. Validate Input Data

Always validate data before sending to API:

```javascript
class Validator {
  static rules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    url: /^https?:\/\/.+$/,
    date: /^\d{4}-\d{2}-\d{2}$/
  };
  
  static validate(data, schema) {
    const errors = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      // Required check
      if (rules.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }
      
      // Type check
      if (value && rules.type) {
        if (rules.type === 'email' && !this.rules.email.test(value)) {
          errors[field] = 'Invalid email format';
        } else if (rules.type === 'phone' && !this.rules.phone.test(value)) {
          errors[field] = 'Invalid phone format';
        } else if (rules.type === 'date' && !this.rules.date.test(value)) {
          errors[field] = 'Invalid date format (YYYY-MM-DD)';
        }
      }
      
      // Length check
      if (value && rules.minLength && value.length < rules.minLength) {
        errors[field] = `Minimum length is ${rules.minLength}`;
      }
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `Maximum length is ${rules.maxLength}`;
      }
    }
    
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }
    
    return true;
  }
}

// Usage
const clientSchema = {
  email: { required: true, type: 'email' },
  first_name: { required: true, minLength: 1, maxLength: 50 },
  last_name: { required: true, minLength: 1, maxLength: 50 },
  phone: { required: false, type: 'phone' }
};

try {
  Validator.validate(clientData, clientSchema);
  // Proceed with API call
} catch (error) {
  console.error('Validation failed:', error.errors);
}
```

### 2. Sanitize Output Data

Clean data received from API:

```javascript
class DataSanitizer {
  static sanitize(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized = {};
      
      for (const [key, value] of Object.entries(data)) {
        // Remove null/undefined values
        if (value != null) {
          // Recursively sanitize nested objects
          sanitized[key] = this.sanitize(value);
        }
      }
      
      return sanitized;
    }
    
    // Sanitize strings
    if (typeof data === 'string') {
      return data.trim();
    }
    
    return data;
  }
  
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}
```

## Security Considerations

### 1. Never Expose Sensitive Data

```javascript
// ❌ Bad: Logging sensitive data
console.log('Session cookie:', document.cookie);
console.log('API response:', response); // May contain sensitive data

// ✅ Good: Log only necessary information
console.log('API call successful, client ID:', response.data.id);
```

### 2. Validate All User Input

```javascript
// ❌ Bad: Direct use of user input
const clientId = userInput;
await fetch(`/api/v1/clients/${clientId}`);

// ✅ Good: Validate and sanitize first
const clientId = sanitizeAndValidateId(userInput);
if (clientId) {
  await fetch(`/api/v1/clients/${clientId}`);
}
```

### 3. Use HTTPS Always

```javascript
// ✅ Good: Enforce HTTPS
if (location.protocol !== 'https:' && !location.hostname.includes('localhost')) {
  location.protocol = 'https:';
}
```

## Monitoring and Logging

### 1. Track API Performance

```javascript
class APIMonitor {
  constructor() {
    this.metrics = [];
  }
  
  async trackRequest(url, fn) {
    const start = performance.now();
    const method = url.split('/').pop();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.metrics.push({
        url,
        method,
        duration,
        success: true,
        timestamp: Date.now()
      });
      
      // Alert on slow requests
      if (duration > 3000) {
        console.warn(`Slow API call: ${url} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.metrics.push({
        url,
        method,
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  getStats() {
    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);
    
    return {
      total: this.metrics.length,
      successful: successful.length,
      failed: failed.length,
      averageTime: successful.reduce((sum, m) => sum + m.duration, 0) / successful.length,
      errorRate: (failed.length / this.metrics.length) * 100
    };
  }
}
```

### 2. Structured Logging

```javascript
class Logger {
  static log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    };
    
    if (level === 'error') {
      console.error(logEntry);
    } else {
      console.log(logEntry);
    }
    
    // Send to logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logEntry);
    }
  }
  
  static info(message, context) {
    this.log('info', message, context);
  }
  
  static error(message, context) {
    this.log('error', message, context);
  }
  
  static debug(message, context) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, context);
    }
  }
}

// Usage
Logger.info('API call successful', {
  endpoint: '/api/v1/clients',
  duration: 234,
  resultCount: 25
});
```

## Testing Your Integration

### 1. Mock API Responses

```javascript
class MockAPI {
  constructor() {
    this.responses = new Map();
  }
  
  mock(pattern, response, status = 200) {
    this.responses.set(pattern, { response, status });
  }
  
  async fetch(url, options) {
    for (const [pattern, config] of this.responses) {
      if (url.includes(pattern)) {
        return {
          ok: config.status >= 200 && config.status < 300,
          status: config.status,
          json: async () => config.response
        };
      }
    }
    
    throw new Error(`No mock found for ${url}`);
  }
}

// Usage in tests
const mockAPI = new MockAPI();
mockAPI.mock('/clients/', {
  data: [
    { id: 'cl_123', name: 'Test Client' }
  ],
  meta: { page: 1, total: 1 }
});
```

### 2. Test Error Scenarios

```javascript
describe('API Error Handling', () => {
  it('should handle 401 authentication errors', async () => {
    mockAPI.mock('/clients/', { error: 'Unauthorized' }, 401);
    
    const client = new PixiesetClient(mockAPI);
    await expect(client.getClients()).rejects.toThrow('Authentication required');
  });
  
  it('should retry on 500 errors', async () => {
    let attempts = 0;
    mockAPI.mock('/clients/', () => {
      attempts++;
      if (attempts < 3) {
        return { error: 'Server error' };
      }
      return { data: [] };
    });
    
    const result = await retryableRequest('/clients/');
    expect(attempts).toBe(3);
    expect(result.data).toEqual([]);
  });
});
```

## Summary

Following these best practices will help you build robust Pixieset API integrations:

1. **Handle authentication properly** - Manage sessions securely
2. **Validate all data** - Both input and output
3. **Optimize performance** - Use caching and batching
4. **Handle errors gracefully** - Implement retry logic and fallbacks
5. **Monitor your integration** - Track performance and errors
6. **Test thoroughly** - Cover success and failure scenarios
7. **Stay defensive** - Remember this is an unofficial API

Most importantly, always be prepared for the API to change without notice and implement appropriate error handling and fallback mechanisms.

## Related Documentation

- [Authentication](/docs/authentication) - Detailed auth implementation
- [Error Handling](/docs/error-handling) - Comprehensive error guide
- [Pagination](/docs/pagination) - Efficient data fetching
- [ID Formats](/docs/id-formats) - Resource ID validation