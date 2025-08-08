---
sidebar_position: 3
title: Error Handling
---

# Error Handling

Understanding how to handle errors is crucial for building robust integrations with the Pixieset API. This guide covers common error scenarios, response formats, and recovery strategies.

## HTTP Status Codes

The Pixieset API uses standard HTTP status codes to indicate the success or failure of requests:

### Success Codes (2xx)

| Status Code | Meaning | Description |
|------------|---------|-------------|
| `200 OK` | Success | Request completed successfully |
| `201 Created` | Created | New resource created successfully |
| `204 No Content` | Success | Request successful with no content to return |

### Client Error Codes (4xx)

| Status Code | Meaning | Common Causes |
|------------|---------|---------------|
| `400 Bad Request` | Invalid Request | Malformed request syntax, invalid parameters |
| `401 Unauthorized` | Authentication Failed | Missing or invalid session cookie |
| `403 Forbidden` | Access Denied | Valid auth but insufficient permissions |
| `404 Not Found` | Resource Not Found | Invalid ID or resource doesn't exist |
| `422 Unprocessable Entity` | Validation Error | Request understood but contains invalid data |
| `429 Too Many Requests` | Rate Limited | Too many requests (if rate limiting exists) |

### Server Error Codes (5xx)

| Status Code | Meaning | Description |
|------------|---------|-------------|
| `500 Internal Server Error` | Server Error | Unexpected server error |
| `502 Bad Gateway` | Gateway Error | Invalid response from upstream server |
| `503 Service Unavailable` | Service Down | Temporary maintenance or overload |

## Error Response Format

Error responses typically follow this structure:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Additional error details when available
    }
  }
}
```

### Common Error Response Examples

#### Authentication Error (401)
```json
{
  "error": {
    "code": "authentication_required",
    "message": "Please log in to access this resource"
  }
}
```

#### Resource Not Found (404)
```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Client with ID cl_InvalidID123 not found"
  }
}
```

#### Validation Error (422)
```json
{
  "error": {
    "code": "validation_failed",
    "message": "Validation failed for the provided data",
    "details": {
      "email": ["Email format is invalid"],
      "phone": ["Phone number must include country code"]
    }
  }
}
```

#### Invalid ID Format (400)
```json
{
  "error": {
    "code": "invalid_id_format",
    "message": "Invalid client ID format",
    "details": {
      "expected_prefix": "cl_",
      "received": "invalid_id_123"
    }
  }
}
```

## Common Error Scenarios

### 1. Authentication Errors

**Scenario**: Session cookie expired or missing

**Error Response**:
```http
HTTP/1.1 401 Unauthorized
```

**Recovery Strategy**:
1. Detect 401 status code
2. Redirect user to login
3. Obtain new session cookie
4. Retry original request

**Implementation Example**:
```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include'
    });
    
    if (response.status === 401) {
      // Session expired - handle re-authentication
      await reauthenticate();
      // Retry the request
      return fetch(url, {
        ...options,
        credentials: 'include'
      });
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### 2. Resource Not Found

**Scenario**: Requesting a deleted or non-existent resource

**Error Response**:
```json
{
  "error": {
    "code": "invoice_not_found",
    "message": "Invoice with ID in_INV001ABC123DEF456GHI789JKL012 not found"
  }
}
```

**Recovery Strategy**:
1. Verify the ID format is correct
2. Check if resource was recently deleted
3. Provide user feedback
4. Offer alternative actions

### 3. Validation Errors

**Scenario**: Submitting invalid data when creating/updating resources

**Error Response**:
```json
{
  "error": {
    "code": "validation_error",
    "message": "The provided data failed validation",
    "details": {
      "amount": ["Amount must be greater than 0"],
      "due_date": ["Due date must be in the future"],
      "currency": ["Currency 'xyz' is not supported"]
    }
  }
}
```

**Recovery Strategy**:
1. Parse validation errors
2. Display field-specific errors to user
3. Allow user to correct data
4. Retry submission

**Implementation Example**:
```javascript
function handleValidationErrors(errorResponse) {
  const errors = errorResponse.error.details;
  
  Object.keys(errors).forEach(field => {
    const fieldErrors = errors[field];
    // Display errors next to the relevant form field
    displayFieldError(field, fieldErrors.join(', '));
  });
}
```

### 4. ID Format Errors

**Scenario**: Using incorrectly formatted resource IDs

**Error Response**:
```json
{
  "error": {
    "code": "invalid_id_format",
    "message": "Client ID must start with 'cl_' prefix",
    "details": {
      "provided": "123456",
      "expected_format": "cl_[30 alphanumeric characters]"
    }
  }
}
```

**Recovery Strategy**:
1. Validate ID format before making request
2. Use correct prefix for resource type
3. Ensure ID hasn't been modified or truncated

### 5. Permission Errors

**Scenario**: Accessing resources without proper permissions

**Error Response**:
```json
{
  "error": {
    "code": "insufficient_permissions",
    "message": "You don't have permission to access this resource"
  }
}
```

**Recovery Strategy**:
1. Verify user permissions
2. Request necessary access
3. Provide alternative options
4. Show appropriate error message

## Error Recovery Strategies

### 1. Automatic Retry Logic

Implement exponential backoff for transient errors:

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Calculate backoff delay
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### 2. Circuit Breaker Pattern

Prevent cascading failures:

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

### 3. Graceful Degradation

Provide fallback behavior when API is unavailable:

```javascript
async function getClientData(clientId) {
  try {
    const response = await fetch(`/api/clients/${clientId}`);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch client data:', error);
    
    // Return cached data if available
    const cachedData = getCachedClientData(clientId);
    if (cachedData) {
      console.log('Using cached data');
      return cachedData;
    }
    
    // Return minimal fallback data
    return {
      id: clientId,
      status: 'unavailable',
      message: 'Unable to load client data'
    };
  }
}
```

## Best Practices for Error Handling

### 1. Always Check Response Status

```javascript
const response = await fetch(url);

if (!response.ok) {
  const errorData = await response.json();
  throw new ApiError(response.status, errorData);
}

const data = await response.json();
```

### 2. Provide Meaningful Error Messages

Transform technical errors into user-friendly messages:

```javascript
function getUserFriendlyError(error) {
  const errorMap = {
    'authentication_required': 'Please log in to continue',
    'invoice_not_found': 'This invoice no longer exists',
    'validation_failed': 'Please check your input and try again',
    'insufficient_permissions': 'You need additional permissions for this action'
  };
  
  return errorMap[error.code] || 'An unexpected error occurred. Please try again.';
}
```

### 3. Log Errors for Debugging

```javascript
function logApiError(error, context) {
  console.error('API Error:', {
    timestamp: new Date().toISOString(),
    error: error.message,
    code: error.code,
    status: error.status,
    context: context,
    stack: error.stack
  });
  
  // Send to error tracking service
  if (window.errorTracker) {
    window.errorTracker.captureException(error, { context });
  }
}
```

### 4. Handle Network Errors

```javascript
async function safeApiCall(url, options) {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
}
```

### 5. Validate Input Before Sending

```javascript
function validateClientData(data) {
  const errors = {};
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Valid email required';
  }
  
  if (!data.first_name || data.first_name.length < 1) {
    errors.first_name = 'First name is required';
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return true;
}
```

## Error Monitoring

### Track Error Patterns

Monitor and analyze error patterns to identify systemic issues:

```javascript
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.errorCounts = {};
  }
  
  trackError(error) {
    this.errors.push({
      timestamp: Date.now(),
      code: error.code,
      status: error.status,
      message: error.message
    });
    
    // Count by error code
    this.errorCounts[error.code] = (this.errorCounts[error.code] || 0) + 1;
    
    // Alert if error threshold exceeded
    if (this.errorCounts[error.code] > 10) {
      this.alertHighErrorRate(error.code);
    }
  }
  
  getErrorStats() {
    return {
      total: this.errors.length,
      byCode: this.errorCounts,
      recentErrors: this.errors.slice(-10)
    };
  }
}
```

## Testing Error Scenarios

Always test error handling in your integration:

```javascript
// Test authentication error handling
describe('API Error Handling', () => {
  it('should handle 401 errors', async () => {
    // Mock 401 response
    fetch.mockResponseOnce('', { status: 401 });
    
    const client = new PixiesetClient();
    await expect(client.getInvoices()).rejects.toThrow('Authentication required');
  });
  
  it('should handle validation errors', async () => {
    const invalidData = { email: 'invalid' };
    
    fetch.mockResponseOnce(JSON.stringify({
      error: {
        code: 'validation_failed',
        details: { email: ['Invalid email format'] }
      }
    }), { status: 422 });
    
    await expect(client.createClient(invalidData))
      .rejects.toThrow('Validation failed');
  });
});
```

## Summary

Effective error handling is essential for building reliable integrations with the Pixieset API:

1. **Understand status codes** - Know what each HTTP status code means
2. **Parse error responses** - Extract meaningful information from error responses
3. **Implement recovery strategies** - Use retries, circuit breakers, and fallbacks
4. **Provide user feedback** - Transform technical errors into helpful messages
5. **Monitor and log** - Track errors to identify and fix issues
6. **Test thoroughly** - Ensure your error handling works as expected

Remember that the Pixieset API is unofficial and reverse-engineered, so error responses may change without notice. Always implement defensive programming practices and graceful error handling.

## Related Documentation

- [Authentication](/docs/authentication) - Session management and auth errors
- [Best Practices](/docs/best-practices) - General API usage guidelines
- [ID Formats](/docs/id-formats) - Avoiding ID-related errors